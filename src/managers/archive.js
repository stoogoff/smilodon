
import JSZip from 'jszip'

import {
	isEmptyArray,
	isEmptyString,
	notEmptyString,
	notIn,
	notNull,
	throwIfNull,
} from 'vue-daisy-ui/utils/assert'
import { createId, slugify } from 'vue-daisy-ui/utils/string'
import TreeManager from '~/managers/tree'
import { project } from '~/state/project'
import { isElement, isCategory } from '~/utils/assert'
import { CATEGORY_ID_PREFIX } from '~/utils/config'
import { createFile, parseFile } from '~/utils/file'

export default {
	// create a ZIP archive and return it
	async create(projectId) {
		const byParent = await TreeManager.loadForProject(projectId)
		const rootProject = await project().byId(projectId)

		const recurseTree = (folder, current) => {
			if(notIn(current, byParent)) return

			const tree = byParent[current]

			tree.forEach(leaf => {
				if(isElement(leaf)) {
					let filename = `${leaf.title}.md`
					let count = 0

					while(notNull(folder.file(filename))) {
						filename = `${leaf.title} (${++count}).md`
					}

					folder.file(filename, createFile(leaf))
				}

				if(isCategory(leaf)) {
					const subfolder = folder.folder(leaf.title)

					recurseTree(subfolder, leaf._id)
				}
			})
		}

		const archive = new JSZip()
		const root = archive.folder(rootProject.title)

		root.file(`project.md`, createFile(rootProject))

		recurseTree(root, '')

		return await archive.generateAsync({ type: 'blob' })
	},

	// extract data from a ZIP file and create relevant project,
	// categories and elements
	async extract(file) {
		const zip = await JSZip.loadAsync(file)
		const entries = []

		// push all entries into an array
		zip.forEach((path, entry) => {
			// skip Mac files
			if(path.startsWith('__MACOSX') || path.includes('.DS_Store')) {
				return
			}

			entries.push(entry)
		})

		const files = await Promise.all(entries.map(async entry => {
			if(entry.dir)
				return Promise.resolve(entry)

			const content = await entry.async('string')

			return Promise.resolve({ ...entry, content: parseFile(content) })
		}))

		const root = files.find(({ name }) => name.endsWith('project.md'))
		const elements = []
		const categories = {}

		throwIfNull(root, 'root', 'Unable to find project file.')

		files.forEach(file => {
			// ignore the project file
			if(file === root) return

			// remove project name from start of path and split on path separator
			const name = file.name.replace(new RegExp(`^${ root.content.title }/`), '')
			const parts = name.substring(0, name.length - 1).split('/')

			if(isEmptyArray(parts) || isEmptyString(parts[0])) return

			// handle elements
			if(!file.dir) {
				elements.push({
					...file.content,
					project: root.content._id,
					category: parts.length > 1 ? categories[parts[parts.length - 2]]._id : '',
				})

				return
			}

			// handle categories
			const title = parts[parts.length - 1]

			categories[title] = {
				_id: CATEGORY_ID_PREFIX + slugify(title) + '-' + createId(4),
				title,
				project: root.content._id,
				parent: parts.length > 1 ? categories[parts[parts.length - 2]]._id : '',
			}
		})

		const bulk = [ root.content, ...Object.values(categories), ...elements ].map(item => {
			delete item._rev

			return item
		})

		await project().db.bulkDocs(bulk)

		return root.content
	},
}
