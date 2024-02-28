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
					<d-button outline error sm @click="openDeleteModal">
						<icon-view icon="trash" />
						Delete
					</d-button>
				</d-card-actions>
				<d-tabs bordered>
					<d-tab label="Description" group="project-edit" active />
					<d-tab-content>
						<div v-html="project.description" />
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

import WithEntities from '~/mixins/with-entities'

export default {
	name: 'ProjectView',
	mixins: [ WithEntities ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
		this.entities = await this.$entities.allByProject(params.projectId)
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
			showDeleteModal: false,
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
	},
}

</script>