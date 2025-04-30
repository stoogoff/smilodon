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
					<d-button outline sm @click="downloadJson">
						<icon-view icon="download" />
						JSON
					</d-button>
					<d-button outline sm @click="downloadArchive">
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
							<markdown class="col-span-3 border-r pr-4 mr-4" :content="project.description" />
							<div>
								<h3 class="mb-2">Project Tags</h3>
								<tag-cloud :tags="tags" />
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Elements" group="project-edit" />
					<d-tab-content>
						<element-table v-if="hasElements" :elements="elements" />
						<p v-else><em>No elements created.</em></p>
					</d-tab-content>
					<d-tab label="Network" group="project-edit" />
					<d-tab-content>
						<network-view />
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
			<p>Deleting a project will also delete all categories and elements in the project. Are you sure you want to continue?</p>
		</confirm-dialogue>
	</section>
</template>
<script>

import { download } from 'vue-daisy-ui/utils/file'
import WithElements from '~/mixins/with-elements'
import Archive from '~/modules/archive'

export default {
	name: 'ProjectView',
	mixins: [ WithElements ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
		this.elements = await this.$elements.allByProject(params.projectId)
		this.tags = await this.$elements.tagsByProject(params.projectId)
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
			const elements = await this.$elements.allByProject(this.project._id)
			const allToDelete = [
				this.project,
				...categories,
				...elements,
			].map(item => ({ ...item, _deleted: true }))

			this.$db.bulkDocs(allToDelete)
			this.showDeleteModal = false
			this.$nuxt.$router.push('/projects')
		},

		async downloadArchive() {
			try {
				const archive = await Archive.create(this.project._id)

				download(`${this.project.title}.zip`, archive)
			}
			catch(err) {
				console.error(err)
				// TODO app message for errors
			}
		},

		async downloadJson() {
			download('projects.json', new Blob([JSON.stringify(this.project, null, 2)]))
			download('elements.json', new Blob([JSON.stringify(this.elements, null, 2)]))

			const categories = await this.$categories.allByProject(this.project._id)

			download('categories.json', new Blob([JSON.stringify(categories, null, 2)]))
		},
	},
}

</script>