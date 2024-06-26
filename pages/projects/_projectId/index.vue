<template>
	<section>
		<loading-spinner v-if="$fetchState.pending" />
		<d-alert v-else-if="project === null" error>
			Unable to load project.
		</d-alert>
		<div v-else>
			<breadcrumb />
			<d-card>
				<d-card-title>
					<icon-view icon="home" />
					{{ project.title }}
				</d-card-title>
				<d-card-actions class="absolute top-6 right-8">
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ project.slug }/edit`">
						<icon-view icon="edit" />
						Edit
					</nuxt-link>
					<d-button outline sm @click="handleDownload">
						<icon-view icon="download" />
						Download
					</d-button>
					<d-button outline error sm @click="openDeleteModal">
						<icon-view icon="trash" />
						Delete
					</d-button>
				</d-card-actions>
				<d-tabs bordered>
					<d-tab label="Description" group="project-edit" active />
					<d-tab-content>
						<div class="grid grid-cols-4">
							<markdown class="col-span-3 border-r border-st-grey pr-4 mr-4" :content="project.description" />
							<div>
								<h3 class="mb-2">Project Tags</h3>
								<tag-cloud :tags="tags" />
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Entities" group="project-edit" />
					<d-tab-content>
						<entity-table v-if="hasEntities" :entities="entities" />
						<p v-else><em>No entities created.</em></p>
					</d-tab-content>
					<d-tab label="Network" group="project-edit" />
					<d-tab-content>
						<em class="text-st-black-pastel">coming soon</em>
					</d-tab-content>
				</d-tabs>
			</d-card>
		</div>
		<confirm-dialogue
			v-if="showDeleteModal"
			title="Delete"
			show-cancel
			@cancel="closeDeleteModal"
			@confirm="handleDelete"
		>
			<p>Deleting a project will also delete all categories and entities in the project. Are you sure you want to continue?</p>
		</confirm-dialogue>
	</section>
</template>
<script>

import { download } from 'vue-daisy-ui/utils/file'
import WithEntities from '~/mixins/with-entities'
import ArchiveManager from '~/managers/archive'

export default {
	name: 'ProjectView',
	mixins: [ WithEntities ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
		this.entities = await this.$entities.allByProject(params.projectId)
		this.tags = await this.$entities.tagsByProject(params.projectId)
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
			showDeleteModal: false,
			tags: [],
		}
	},

	methods: {
		closeDeleteModal() {
			this.showDeleteModal = false
		},

		openDeleteModal() {
			this.showDeleteModal = true
		},

		async handleDelete() {
			const categories = await this.$categories.allByProject(this.project._id)
			const entities = await this.$entities.allByProject(this.project._id)
			const allToDelete = [
				this.project,
				...categories,
				...entities,
			].map(item => ({ ...item, _deleted: true }))

			this.$db.bulkDocs(allToDelete)
			this.showDeleteModal = false
			this.$nuxt.$router.push('/projects')
		},

		async handleDownload() {
			try {
				const archive = await ArchiveManager.create(this.project._id)

				download(`${this.project.title}.zip`, archive)
			}
			catch(err) {
				console.error(err)
				// TODO app message for errors
			}
		},
	},
}

</script>