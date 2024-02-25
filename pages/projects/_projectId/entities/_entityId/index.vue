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
					<nuxt-link class="btn btn-primary btn-sm" :to="`${ entity.slug }/edit`">Edit</nuxt-link>
					<d-button outline error sm @click="deleteEntity">Delete</d-button>
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
	</section>
</template>
<script>

import WithEntity from '~/mixins/with-entity'

export default {
	name: 'EntityView',
	mixins: [ WithEntity ],

	methods: {
		async deleteEntity() {
			const project = await this.$projects.byId(this.entity.project)

			this.$entities.delete(this.entity)
			this.$nuxt.$router.push(project.slug)
		},
	},
}

</script>