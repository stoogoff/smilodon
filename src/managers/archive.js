
import JSZip from 'jszip'

import {
	isEmptyArray,
	isEmptyString,
	notIn,
	notNull,
} from 'vue-daisy-ui/utils/assert'
import TreeManager from '~/managers/tree'
import { project } from '~/state/project'
import { isElement, isCategory } from '~/utils/assert'
import { PROJECT_FILE_NAME } from '~/utils/config'
import { createFile, parseFile, fileExtension } from '~/utils/file'

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

		root.file(PROJECT_FILE_NAME, createFile(rootProject))

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
			// skip Mac files and non-Markdown files
			const ext = fileExtension(path)

			if(path.startsWith('__MACOSX') || path.includes('.DS_Store') || (ext !== null && ext !== '.md')) {
				return
			}

			entries.push(entry)
		})

		// the zip isn't really a backup file
		if(entries.length === 0) {
			throw new Error('No Markdown files found in zip.')
		}

		const files = await Promise.all(entries.map(async entry => {
			if(entry.dir) {
				return Promise.resolve(entry)
			}

			const content = await entry.async('string')

			return Promise.resolve({ ...entry, content: parseFile(content) })
		}))

		const root = files.find(({ name }) => name.endsWith(PROJECT_FILE_NAME))
		const elements = []
		const categories = []

		files.forEach(file => {
			// ignore the project file
			if(file === root) return

			// remove project name from start of path and split on path separator
			const name = file.name.substring(file.name.indexOf('/') + 1) 
			const parts = name.substring(0, name.length - 1).split('/')

			if(isEmptyArray(parts) || isEmptyString(parts[0])) return

			const title = parts.pop()
			const path = parts.join('/')

			// handle elements
			if(!file.dir) {
				elements.push({
					...file.content,
					category: path,
				})

				return
			}

			// create categories
			categories.push({
				title,
				parent: path,
			})
		})

		return {
			project: notNull(root) ? root.content : { title: file.name.substring(0, file.name.lastIndexOf('.')) },
			categories,
			elements,
		}
	},
}
