<template>
	<section>
		<we-loading-spinner v-if="$fetchState.pending" />
		<we-alert-view v-else-if="project === null" type="warning">
			Unable to load project.
		</we-alert-view>
		<div v-else>
			<h1>{{ project.title }}</h1>
			<we-link-action small :to="`${ project.slug }/edit`">Edit</we-link-action>
			<we-button-action small @click="openDeleteModal">Delete</we-button-action>
			<we-tab-group>
				<we-tab-panel title="Description">
					<div v-html="project.description" />
				</we-tab-panel>
				<we-tab-panel title="Entities">
					<entity-table v-if="hasEntities" :entities="entities" />
					<p v-else><em>No entities created.</em></p>
				</we-tab-panel>
			</we-tab-group>
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