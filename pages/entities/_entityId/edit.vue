<template>
	<section>
		<we-loading-spinner v-if="entity === null" />
		<entity-editor v-else :entity="entity" @save="save" />
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
			this.$nuxt.context.redirect(`/entities/${this.entity.slug}`)
		},
	},
}

</script>