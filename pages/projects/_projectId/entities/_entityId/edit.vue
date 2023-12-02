<template>
	<section>
		<we-loading-spinner v-if="entity === null" />
		<div v-else>
			<h1>Editing: {{ entity.title }}</h1>
			<entity-editor :entity="entity" @save="save" />
		</div>
	</section>
</template>
<script>

import WithEntity from '~/mixins/with-entity'

export default {
	layout: 'no-action',
	name: 'EntityEdit',
	mixins: [ WithEntity ],

	methods: {
		save(entity) {
			this.$nuxt.context.redirect(this.entity.slug)
		},
	},
}

</script>