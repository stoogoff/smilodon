<template>
	<section>
		<loading-spinner v-if="element === null" />
		<div v-else>
			<breadcrumb />
			<d-card>
				<d-card-title>
					<element-icon :element="element" />
					{{ element.title }}
				</d-card-title>
				<d-card-actions class="absolute top-6 right-8">
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ element.slug }/edit`">
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
					<div>This element has unsaved changes. You can <nuxt-link class="link" :to="`${ element.slug }/edit`">edit the element</nuxt-link> or <span class="link" @click="discardChanges">discard the changes</span>.</div>
				</d-alert>
				<d-tabs bordered>
					<d-tab label="Description" group="element-view" active />
					<d-tab-content>
						<div class="grid grid-cols-4">
							<markdown class="col-span-3 border-r pr-4 mr-4" :content="element.description" />
							<div>
								<h3 v-if="element.tags.length > 0" class="mb-2">Tags</h3>
								<tag-list :tags="element.tags" />
								<div v-if="linked.length > 0">
									<div class="grid grid-cols-2">
										<h3 class="my-2">Connections</h3>
										<popup-button y="top" x="right" class="justify-self-end">
											Filter
											<template #popup>
												<ul>
													<li v-for="filter in connectionFilters" :key="filter.label">
														<label>
															<d-checkbox sm
																:value="filter.value"
																@input="filter.toggle()" />
															{{ filter.label }}
														</label>
													</li>
												</ul>
											</template>
										</popup-button>
									</div>
									<table class="table">
										<tbody>
											<tr
												v-for="link in filteredLinks"
												:key="`connections_${ link._id }`"
												class="hover:bg-base-200">
												<td>
													<nuxt-link
														class="link hover:link-primary"
														:to="link.slug">{{ link.title }}</nuxt-link>
												</td>
												<td align="right">
													<icon-view v-if="link.isCategory" icon="folder" data-tip="Category" class="tooltip" :class="{ 'text-primary': showCategories }" />
													<icon-view v-if="link.isMention" icon="chat" data-tip="Mention" class="tooltip" :class="{ 'text-primary': showMentions }" />
													<icon-view v-if="link.isLink" icon="link" data-tip="Link" class="tooltip" :class="{ 'text-primary': showLinks }" />
													<icon-view v-if="link.isTag" icon="tag" data-tip="Tag" class="tooltip" :class="{ 'text-primary': showTags }" />
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Properties" group="element-view" />
					<d-tab-content>
						<ul v-if="element.properties.length">
							<li
								v-for="property in element.properties"
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
			<p>Are you sure you want to delete this element and all its properties?</p>
		</confirm-dialogue>
	</section>
</template>
<script>

import { notEmptyString } from 'vue-daisy-ui/utils/assert'
import { local } from 'vue-daisy-ui/utils/storage'

export default {
	name: 'ElementView',

	async fetch() {
		const { params } = this.$nuxt.context

		this.element = await this.$elements.byId(params.elementId)
		this.linked = await this.$elements.connections(this.element)
	},
	fetchOnServer: false,

	data() {
		return {
			element: null,
			linked: [],
			showDeleteModal: false,
			showCategories: true,
			showLinks: true,
			showMentions: true,
			showTags: true,
		}
	},

	computed: {
		hasUnsavedChanges() {
			return this.element ? local.has(this.element._id) : false
		},

		connectionFilters() {
			return [
				{
					label: 'Categories',
					value: this.showCategories,
					toggle: () => this.showCategories = !this.showCategories,
				},
				{
					label: 'Links',
					value: this.showLinks,
					toggle: () => this.showLinks = !this.showLinks,
				},
				{
					label: 'Mentions',
					value: this.showMentions,
					toggle: () => this.showMentions = !this.showMentions,
				},
				{
					label: 'Tags',
					value: this.showTags,
					toggle: () => this.showTags = !this.showTags,
				},
			]
		},

		filteredLinks() {
			return this.linked.filter(link =>
				link.isCategory && this.showCategories ||
				link.isLink && this.showLinks ||
				link.isMention && this.showMentions ||
				link.isTag && this.showTags)
		},
	},

	methods: {
		closeDeleteModal() {
			this.showDeleteModal = false
		},

		openDeleteModal() {
			this.showDeleteModal = true
		},

		discardChanges() {
			local.remove(this.element._id)
			this.element = { ...this.element } // HACK force computed to update
		},

		async handleDelete() {
			const  next = notEmptyString(this.element.category)
				? await this.$categories.byId(this.element.category)
				: await this.$projects.byId(this.element.project)

			this.$elements.delete(this.element)
			this.showDeleteModal = false
			this.$nuxt.$router.push(next.slug)
		},
	},
}

</script>