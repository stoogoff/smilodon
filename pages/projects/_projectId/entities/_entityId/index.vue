<template>
	<section>
		<loading-spinner v-if="entity === null" />
		<div v-else>
			<breadcrumb />
			<d-card>
				<d-card-title>
					<entity-icon :entity="entity" />
					{{ entity.title }}
				</d-card-title>
				<d-card-actions class="absolute top-6 right-8">
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ entity.slug }/edit`">
						<icon-view icon="edit" />
						Edit
					</nuxt-link>
					<d-button outline error sm @click="openDeleteModal">
						<icon-view icon="trash" />
						Delete
					</d-button>
				</d-card-actions>
				<d-tabs bordered>
					<d-tab label="Description" group="entity-view" active />
					<d-tab-content>
						<div class="grid grid-cols-4">
							<markdown class="col-span-3 border-r border-st-grey pr-4 mr-4" :content="entity.description" />
							<div>
								<h3 class="mb-2">Tags</h3>
								<tag-list :tags="entity.tags" />
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Properties" group="entity-view" />
					<d-tab-content>
						<ul>
							<li
								v-for="property in entity.properties"
								:key="property.id"
							>
								<strong>{{ property.name }}:</strong> {{ property.value }}
							</li>
						</ul>
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
			<p>Are you sure you want to delete this entity and all its properties?</p>
		</confirm-dialogue>
	</section>
</template>
<script>

import WithEntity from '~/mixins/with-entity'

export default {
	name: 'EntityView',
	mixins: [ WithEntity ],

	data() {
		return {
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
			const parent = await this.$categories.byId(this.entity.category)

			this.$entities.delete(this.entity)
			this.showDeleteModal = false
			this.$nuxt.$router.push(parent.slug)
		},
	},
}

</script>