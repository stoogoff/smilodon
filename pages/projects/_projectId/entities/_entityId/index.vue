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
				<d-alert warning v-if="hasUnsavedChanges">
					<icon-view icon="alert" />
					<div>This entity has unsaved changes. You can <nuxt-link class="link" :to="`${ entity.slug }/edit`">edit the entity</nuxt-link> or <span class="link" @click="discardChanges">discard the changes</span>.</div>
				</d-alert>
				<d-tabs bordered>
					<d-tab label="Description" group="entity-view" active />
					<d-tab-content>
						<div class="grid grid-cols-4">
							<markdown class="col-span-3 border-r border-st-grey pr-4 mr-4" :content="entity.description" />
							<div>
								<h3 v-if="entity.tags.length > 0" class="mb-2">Tags</h3>
								<tag-list :tags="entity.tags" />
								<div v-if="linked.length > 0">
									<div class="grid grid-cols-2">
										<h3 class="my-2">Connections</h3>
										<popup-button y="top" x="right" class="justify-self-end">
											Filter
											<template #popup>
												<ul>
													<li>
														<label>
															<d-checkbox sm
																:value="showTags"
																@input="showTags = !showTags" />
															Tags
														</label>
													</li>
													<li>
														<label>
															<d-checkbox sm
																:value="showCategories"
																@input="showCategories = !showCategories" />
															Categories
														</label>
													</li>
												</ul>
											</template>
										</popup-button>
									</div>
									<table class="table">
										<tbody>
											<tr
												v-for="link in linked"
												:key="link._id"
												v-if="canShowConnection(link)"
												class="hover:bg-st-yellow-pale">
												<td>
													<nuxt-link
														class="link"
														:to="link.slug">{{ link.title }}</nuxt-link>
												</td>
												<td align="right">
													<icon-view v-if="link.isTag" icon="tag" />
													<icon-view v-if="link.isCategory" icon="folder" />
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Properties" group="entity-view" />
					<d-tab-content>
						<ul v-if="entity.properties.length">
							<li
								v-for="property in entity.properties"
								:key="property.id"
							>
								<strong>{{ property.name }}:</strong> {{ property.value }}
							</li>
						</ul>
						<p v-else><em>No properties set</em></p>
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

import { notEmptyString } from '~/utils/assert'
import { local } from '~/utils/storage'

export default {
	name: 'EntityView',

	async fetch() {
		const { params } = this.$nuxt.context

		this.entity = await this.$entities.byId(params.entityId)
		this.linked = await this.$entities.connections(this.entity)
	},
	fetchOnServer: false,

	data() {
		return {
			entity: null,
			linked: [],
			showDeleteModal: false,
			showTags: true,
			showCategories: true,
		}
	},

	computed: {
		hasUnsavedChanges() {
			return this.entity ? local.has(this.entity._id) : false
		},
	},

	methods: {
		closeDeleteModal() {
			this.showDeleteModal = false
		},

		openDeleteModal() {
			this.showDeleteModal = true
		},

		canShowConnection(link) {
			if(!this.showTags && !this.showCategories) return false
			if(!this.showTags && link.isTag && !link.isCategory) return false
			if(!this.showCategories && link.isCategory && !link.isTag) return false

			return true
		},

		discardChanges() {
			local.remove(this.entity._id)
			this.entity = { ...this.entity } // HACK force computed to update
		},

		async handleDelete() {
			const  next = notEmptyString(this.entity.category)
				? await this.$categories.byId(this.entity.category)
				: await this.$projects.byId(this.entity.project)

			this.$entities.delete(this.entity)
			this.showDeleteModal = false
			this.$nuxt.$router.push(next.slug)
		},
	},
}

</script>