<template>
	<section>
		<d-loading spinner lg v-if="entity === null" />
		<div v-else>
			<h1>
				<entity-icon v-if="entity.icon" :entity="entity" />
				{{ entity.title }}
			</h1>
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
			<d-join horizontal>
				<nuxt-link class="join-item btn btn-primary btn-sm" :to="`${ entity.slug }/edit`">Edit</nuxt-link>
				<d-button class="join-item" error sm @click="deleteEntity">Delete</d-button>
			</d-join>
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