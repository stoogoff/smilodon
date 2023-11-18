<template>
	<section>
		<we-loading-spinner v-if="entity === null" />
		<div v-else>
			<h1>
				<entity-icon v-if="entity.icon" :entity="entity" />
				{{ entity.title }}
			</h1>
			<p>{{ entity.description }}</p>
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
	name: 'EntityIndexPage',
	mixins: [ WithEntity ],

	methods: {
		deleteEntity() {
			this.$entities.delete(this.entity)
			this.$nuxt.context.redirect('/')
		},
	},
}

</script>