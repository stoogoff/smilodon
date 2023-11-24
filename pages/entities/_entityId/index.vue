<template>
	<section>
		<we-loading-spinner v-if="entity === null" />
		<div v-else>
			<h1>
				<entity-icon v-if="entity.icon" :entity="entity" />
				{{ entity.title }}
			</h1>
			<!-- TODO Markdown -->
			<p>{{ entity.description }}</p>
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
			<we-link-action type="primary" :to="`/entities/${entity.slug}/edit`">Edit</we-link-action>
			<we-button-action type="warning" @click="deleteEntity">Delete</we-button-action>
		</div>
	</section>
</template>
<script>

import WithEntity from '~/mixins/with-entity'

export default {
	name: 'EntityView',
	mixins: [ WithEntity ],

	methods: {
		deleteEntity() {
			this.$entities.delete(this.entity)
			this.$nuxt.context.redirect('/')
		},
	},
}

</script>