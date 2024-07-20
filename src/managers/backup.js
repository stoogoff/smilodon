
import { notNull, throwIfNull } from 'vue-daisy-ui/utils/assert'
import { project } from '~/state/project'

import RestoreNew from '~/managers/restore/restore-new'
import RestoreExisting from '~/managers/restore/restore-existing'
import RestoreEmpty from '~/managers/restore/restore-empty'

export default {
	async restore(data) {
		// 1. if the project DOES exist diff elements and, if different it needs to save it to local storage for the user to address
		// 2. if a project with the extracted project id doesn't exist, just save it
		// 3. if the default project file isn't available it saves a new project
		let restore = null

		if(notNull(data.project._id)) {
			const existing = await project().byId(data.project._id)

			if(notNull(existing)) {
				// option 1 - project exists so save new stuff and store a diff for existing stuff
				restore = new RestoreExisting(existing._id, data.categories, data.elements)
			}
			else {
				// option 2 - project doesn't exist so create it
				delete data.project._rev

				const updated = await project().save(data.project)

				restore = new RestoreNew(updated._id, data.categories, data.elements)
			}
		}
		else {
			// option 3 - no project so create a new one
			// TODO - would this be better if it tried to infer the project from an existing element?
			// it could try to load an element from the db and, if it exists, use the element's
			// project as a base. It would need to go through all elements and try to load them...
			const newProject = await project().create(data.project)

			restore = new RestoreEmpty(newProject._id, data.categories, data.elements)
		}

		throwIfNull(restore, 'restore')

		await restore.save()
	},
}
