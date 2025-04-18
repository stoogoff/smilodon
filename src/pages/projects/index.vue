<template>
	<section>
		<h1>Projects</h1>
		<div class="py-4">
			<p>This will allow for CRUD actions for projects</p>
			<nuxt-link class="btn btn-primary" to="/projects/create">Create Project</nuxt-link>
		</div>

		<d-drop-zone @input="extractFiles" :accept="['application/zip']">
			Drag a zip file or click to upload one.
		</d-drop-zone>

		<div class="md:grid md:grid-cols-2 md:gap-4">
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
		</div>
	</section>
</template>
<script>

import { notEmptyArray, notEmptyString, notNull } from 'vue-daisy-ui/utils/assert'
import Archive from '~/modules/archive'
import Backup from '~/modules/backup'
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
					const data = await Archive.extract(files[0])

					await Backup.restore(data)

					EventBus.$emit(ELEMENTS_UPDATED)
					EventBus.$emit(CATEGORIES_UPDATED)
					EventBus.$emit(PROJECTS_UPDATED)
					EventBus.$emit(SHOW_MESSAGE, {
						type: 'success',
						text: `Successfully imported project '${ data.project.title }'.`,
					})
				}
				catch(err) {
					console.error(err)
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