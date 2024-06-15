<template>
	<section>
		<loading-spinner v-if="category === null" />
		<div v-else>
			<breadcrumb />
			<d-card>
				<d-card-title>
					<icon-view icon="folder" />
					{{ category.title }}
				</d-card-title>
				<d-card-actions class="absolute top-6 right-8">
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ category.slug }/edit`">
						<icon-view icon="edit" />
						Edit
					</nuxt-link>
					<d-button outline error sm @click="openDeleteModal">
						<icon-view icon="trash" />
						Delete
					</d-button>
				</d-card-actions>
				<d-tabs bordered>
					<d-tab label="Entities" group="category-view" active />
					<d-tab-content>
						<entity-table :entities="entities" />
					</d-tab-content>
					<d-tab label="Network" group="category-view" />
					<d-tab-content>
						<!-- entity-map :category="category" / -->
						<em>Coming soon</em>
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
			<p>Deleting a category will also delete all entities in the category. Are you sure you want to continue?</p>
		</confirm-dialogue>
	</section>
</template>
<script>

import WithEntities from '~/mixins/with-entities'

export default {
	name: 'CategoryView',
	mixins: [ WithEntities ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.entities = await this.$entities.allByCategory(params.categoryId)
		this.category = await this.$categories.byId(params.categoryId)
	},
	fetchOnServer: false,

	data() {
		return {
			category: null,
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
			const project = await this.$projects.byId(this.category.project)
			const categories = [ this.category, ...await this.$categories.allDeep(this.category) ]
			const entities = (await Promise.all(categories.map(category =>
				this.$entities.allByCategory(category._id)
			))).flat()

			const allToDelete = [
				...categories,
				...entities,
			].map(item => ({ ...item, _deleted: true }))

			this.$db.bulkDocs(allToDelete)
			this.showDeleteModal = false
			this.$nuxt.$router.push(project.slug)
		},
	},
}

</script>
