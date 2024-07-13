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

import { notEmptyArray } from 'vue-daisy-ui/utils/assert'
import ArchiveManager from '~/managers/archive'
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
		async extractFiles(files) {
			if(notEmptyArray(files)) {
				try {
					const project = await ArchiveManager.extract(files[0])

					EventBus.$emit(ELEMENTS_UPDATED)
					EventBus.$emit(CATEGORIES_UPDATED)
					EventBus.$emit(PROJECTS_UPDATED)
					EventBus.$emit(SHOW_MESSAGE, { type: 'success', text: `Successfully imported project '${ project.title }'.` })
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