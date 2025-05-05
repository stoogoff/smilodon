<template>
	<section>
		<h1 class="ml-8 mt-8 mb-4">Dashboard</h1>
	 	<div class="md:grid md:grid-cols-2 md:gap-8">
			<div>
				<d-card class="mb-4">
					<d-card-title>Projects</d-card-title>
					<p>Use the button below to start working on a new project or use the plus icon in the sidebar on the left.</p>
					<nuxt-link class="btn btn-primary" to="/projects/create">Create New Project</nuxt-link>
				</d-card>

				<d-card>
					<d-card-title>Backups</d-card-title>
					<p>You can backup any project using the <strong>Download</strong> button on the project page. This will create a <code>.zip</code> archive with all of the categories and elements of the project and download it to your computer. If you extract the zip file by double clicking on it, all of your elements will be saved to your computer as text files in folders matching the category structure used. The text files use <a href="https://www.markdownguide.org/" target="_blank" class="link text-primary">Markdown syntax</a> and have a <code>.md</code> extension.</p>

					<p>You can open the files in any text editor and make any changes you need to, zip everything back up and drag the file to the space below. <em>reticula</em> will merge any changes to your project with what it is stored, so you can view the tags, relationships and network that connects the project’s elements together. If it can’t match the zip file to a project it will create a new one for you.</p>

					<d-drop-zone @input="extractFiles" :accept="['application/zip']">
						Drag a zip file or click to upload one.
					</d-drop-zone>
				</d-card>
			</div>

			<div>
				<loading-spinner v-if="$fetchState.pending" />
				<d-card
					v-else
					v-for="project in projects"
					:key="project._id"
					class="mb-4"
				>
					<d-card-title>
						<nuxt-link :to="project.slug" class="hover:text-primary">{{ project.title }}</nuxt-link>
					</d-card-title>
					<markdown :content="project.description" />
					<d-card-actions>
						<nuxt-link class="btn btn-primary" :to="project.slug">View</nuxt-link>
					</d-card-actions>
				</d-card>
			</div>
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
<style scoped>

p {
	@apply mb-4;
}
code {
	@apply inline-block px-1 py-0.5 bg-base-200 rounded border border-base-300;
}

</style>