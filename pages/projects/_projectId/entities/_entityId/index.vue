<template>
	<section>
		<d-loading spinner lg v-if="entity === null" />
		<div v-else>
			<breadcrumb />
			<d-card class="bg-base-100 shadow">
				<template #title>
					<h1>
						<entity-icon v-if="entity.icon" :entity="entity" />
						{{ entity.title }}
					</h1>
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ entity.slug }/edit`">
						<d-icon :icon="editIcon" />
						Edit
					</nuxt-link>
					<d-button outline accent sm @click="openDeleteModal">
						<d-icon :icon="trashIcon" />
						Delete
					</d-button>
				</template>
				<div v-html="entity.description" />
				<ul>
					<li
						v-for="property in entity.properties"
						:key="property.id"
					>
						<strong>{{ property.name }}:</strong> {{ property.value }}
					</li>
				</ul>
				<div>
					<h2>Tags</h2>
					<tag-list :tags="entity.tags" />
				</div>
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
import { trash, edit } from '~/utils/icons'

export default {
	name: 'EntityView',
	mixins: [ WithEntity ],

	data() {
		return {
			showDeleteModal: false,
		}
	},

	computed: {
		trashIcon() {
			return trash
		},
		editIcon() {
			return edit
		},
	},

	methods: {
		closeDeleteModal() {
			this.showDeleteModal = false
		},

		openDeleteModal() {
			this.showDeleteModal = true
		},

		async handleDelete() {
			const project = await this.$projects.byId(this.entity.project)

			this.$entities.delete(this.entity)
			this.$nuxt.$router.push(project.slug)
		},
	},
}

</script>