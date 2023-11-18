<template>
	<div>
		<h1>Entities</h1>
		<ul>
			<li v-for="entity in entities" :key="entity._id">
				{{ entity.title }}
				<we-button-action @click="deleteEntity(entity)" type="warning">Delete</we-button-action>
			</li>
		</ul>
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

	methods: {
		deleteEntity(entity) {
			this.$entities.delete(entity)
			this.$fetch()
		},
	},
}

</script>