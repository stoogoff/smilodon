<template>
	<div>
		<h1>Entities</h1>

		<entity-table v-if="hasEntities" :entities="entities" />
		<p v-else><em>No entities</em></p>
	</div>
</template>
<script>

import { EventBus } from '~/utils/event-bus'
import { ENTITIES_UPDATED } from '~/utils/config'

export default {
	name: 'IndexPage',

	async fetch() {
		this.entities = await this.$entities.all()
	},
	fetchOnServer: false,

	data() {
		return {
			entities: [],
		}
	},

	mounted() {
		EventBus.$on(ENTITIES_UPDATED, this.$fetch)
	},

	beforeDestroy() {
		EventBus.$off(ENTITIES_UPDATED)
	},

	computed: {
		hasEntities() {
			return this.entities.length > 0
		}
	},
}

</script>