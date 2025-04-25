<template>
	<section>
		<loading-spinner v-if="$fetchState.pending" />
		<d-alert v-else-if="element === null" error>
			Unable to load element.
		</d-alert>
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
								<connection-filter :linked="linked" />
							</div>
						</div>
					</d-tab-content>
					<d-tab label="Properties" group="element-view" />
					<d-tab-content>
						<dl v-if="element.properties.length" class="grid grid-cols-4">
							<div
								v-for="property in element.properties"
								class="col-span-3 grid grid-cols-4 gap-2 border-b last:border-b-0 py-1"
								:key="`dl_${property.id}`"
							>
								<dt class="font-bold">{{ property.name }}:</dt>
								<dd class="col-span-3"><property-view :property="property" /></dd>
							</div>
						</dl>
						<p v-else><em>No properties set</em></p>
					</d-tab-content>
					<d-tab label="Network" group="element-view" />
					<d-tab-content>
						<element-map :element="element" :linked="linked" />
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
import Diff from '~/modules/diff'

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
		}
	},

	computed: {
		hasUnsavedChanges() {
			return this.element ? Diff.hasDiff(this.element._id) : false
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
			Diff.removeDiff(this.element._id)
			this.element = { ...this.element } // HACK force computed to update
		},

		async handleDelete() {
			const next = notEmptyString(this.element.category)
				? await this.$categories.byId(this.element.category)
				: await this.$projects.byId(this.element.project)

			this.$elements.delete(this.element)
			this.showDeleteModal = false
			this.$nuxt.$router.push(next.slug)
		},
	},
}

</script>