
import JSZip from 'jszip'
import YAML from 'yaml'

import TreeManager from '~/managers/tree'
import { project } from '~/state/project'
import { notNull, notEmptyString, isEntity, isCategory } from '~/utils/assert'

export default {
	// create a ZIP archive and return it
	async create(projectId) {
		const byParent = await TreeManager.loadForProject(projectId)
		const rootProject = await project().byId(projectId)

		const recurseTree = (folder, current) => {
			if(!(current in byParent)) return

			const tree = byParent[current]

			tree.forEach(leaf => {
				if(isEntity(leaf)) {
					let filename = `${leaf.title}.md`
					let count = 0

					while(notNull(folder.file(filename))) {
						filename = `${leaf.title} (${++count}).md`
					}

					folder.file(filename, this.createMarkdownFile(leaf))
				}

				if(isCategory(leaf)) {
					const subfolder = folder.folder(leaf.title)

					recurseTree(subfolder, leaf._id)
				}
			})
		}

		const archive = new JSZip()
		const root = archive.folder(rootProject.title)

		root.file(`${rootProject.title}.md`, this.createMarkdownFile(rootProject))

		recurseTree(root, '')

		return await archive.generateAsync({ type: 'blob' })
	},

	createMarkdownFile(obj) {
		const copy = { ...obj }
		const ignore = ['_id', '_rev', 'slug', 'project', 'category', 'icon', 'description']

		Object.keys(copy).filter(key => ignore.includes(key)).forEach(key => delete copy[key])

		const header = YAML.stringify(copy)
		const buffer = []

		if(notEmptyString(header)) {
			buffer.push('---')
			buffer.push(header + '---\n')
		}

		if(obj.title)
			buffer.push(`# ${obj.title}\n`)

		if(obj.description)
			buffer.push(`${obj.description}\n`)

		return buffer.join('\n')
	},
}
