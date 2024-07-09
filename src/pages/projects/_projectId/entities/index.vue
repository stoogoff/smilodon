<template>
	<section>
		<h1>Entities</h1>
		<entity-table v-if="hasEntities" :entities="entities" />
		<p v-else><em>No entities</em></p>
	</section>
</template>
<script>

import WithEntities from '~/mixins/with-entities'

export default {
	name: 'EntitiesIndex',
	mixins: [ WithEntities ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.entities = await this.$entities.allByProject(params.projectId)
	},
	fetchOnServer: false,
}

</script>