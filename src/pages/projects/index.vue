<template>
	<section>
		<h1>Projects</h1>
		<p>This will allow for CRUD actions for projects</p>
		<nuxt-link class="btn" to="/projects/create">Create Project</nuxt-link>

		<d-drop-zone @input="extractFiles" :accept="['application/zip']">
			Drag a zip file or click to upload one.
		</d-drop-zone>

		<d-card
			v-for="project in projects"
			:key="project._id"
			class="mb-4"
		>
			<d-card-title>{{ project.title }}</d-card-title>
			<markdown :content="project.description" />
			<d-card-actions>
				<nuxt-link class="btn btn-primary" :to="project.slug">View</nuxt-link>
			</d-card-actions>
		</d-card>
	</section>
</template>
<script>

import { notEmptyArray, notEmptyString, notNull } from 'vue-daisy-ui/utils/assert'
import ArchiveManager from '~/managers/archive'
import DiffManager from '~/managers/diff'
import WithProjects from '~/mixins/with-projects'
import { EventBus } from '~/utils/event-bus'
import {
	ELEMENTS_UPDATED,
	CATEGORIES_UPDATED,
	PROJECTS_UPDATED,
	SHOW_MESSAGE
} from '~/utils/config'

export default {
	name: 'Projects',
	layout: 'no-project',
	mixins: [ WithProjects ],

	async fetch() {
		this.projects = await this.$projects.all()
	},
	fetchOnServer: false,

	methods: {
		// prepare an object for creation by removing its _id and _rev properties
		// if a project id is passed, set that
		_prepare(obj, projectId) {
			delete obj._id
			delete obj._rev

			if(notNull(projectId)) {
				obj.project = projectId
			}

			return obj
		},

		// save the given categories and elements with the supplied project id
		async _saveProjectData(projectId, categories, elements) {
			// make a note of category title => id
			const categoryTitleIdMap = {}

			// loop through categories in order and save
			// the zipper archive reads folders depth-first sequentially so
			// this should be fine
			for(let i = 0, len = categories.length; i < len; ++i) {
				const category = this._prepare(categories[i], projectId)

				// get the parent category by its title, if the category has a parent
				if(notEmptyString(category.parent)) {
					category.parent = categoryTitleIdMap[category.parent]
				}

				// keep the id and title to map for nested categories and elements
				const { _id, title } = await this.$categories.create(category)

				categoryTitleIdMap[title] = _id
			}

			// save all elements with no concern for order
			await Promise.all(elements.map(async element => {
				element = this._prepare(element, projectId)

				// get the category by its title, if the element has one
				if(notEmptyString(element.category)) {
					element.category = categoryTitleIdMap[element.category]
				}

				return this.$elements.create(element)
			}))
		},

		async extractFiles(files) {
			if(notEmptyArray(files)) {
				try {
					// TODO this will return a project which needs to be saved
					// 1. if the project DOES exist it's more involved. It needs to diff element and, if different it needs to save it to local storage for the user to address
					// AND on that note, the auto-save stuff needs to show a diff of the content so the
					// user can make an  informed decision on what to do
					// 2. if a project with the extracted project id doesn't exist, just save it
					// 3. if the project.md file isn't available it should notify the user and let them create a new one (OR automatically create the new one and let them modify as they need to)
					const { project, categories, elements } = await ArchiveManager.extract(files[0])

					if(notNull(project._id)) {
						const existing = await this.$projects.byId(project._id)

						if(notNull(existing)) {
							// TODO option 1
						}
						else {
							// option 2 - project doesn't exist so create it
							const updated = await this.$projects.create(this._prepare(project))

							await this._saveProjectData(updated._id, categories, elements)
						}
					}
					else {
						// option 3 - no project so create a new one
						const newProject = await this.$projects.create(project)

						await this._saveProjectData(newProject._id, categories, elements)
					}

					EventBus.$emit(ELEMENTS_UPDATED)
					EventBus.$emit(CATEGORIES_UPDATED)
					EventBus.$emit(PROJECTS_UPDATED)
					EventBus.$emit(SHOW_MESSAGE, {
						type: 'success',
						text: `Successfully imported project '${ project.title }'.`,
					})
				}
				catch(err) {
					EventBus.$emit(SHOW_MESSAGE, { type: 'error', text: err.message })
				}
			}
			else {
				EventBus.$emit(SHOW_MESSAGE, { type: 'error', text: 'Unable to read file.' })
			}
		}
	},
}

</script>