<template>
	<ul>
		<category-item
			v-for="category in categories"
			:key="category._id"
			:category="category"
		/>
		<entity-item
			v-for="entity in entities"
			:key="entity._id"
			:entity="entity"
		/>
	</ul>	
</template>
<script>

import Vue from 'vue'
import { EventBus } from '~/utils/event-bus'
import { CATEGORIES_UPDATED } from '~/utils/config'

export default Vue.component('CategoryTree', {
	props: {
		parent: {
			type: String,
			default: '',
		},
	},

	async fetch() {
		const { params } = this.$nuxt.context

		this.categories = await this.$categories.allWithParent(params.projectId, this.parent)
		this.entities = await this.$entities.allByCategory(this.parent)
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
			entities: [],
		}
	},

	mounted() {
		EventBus.$on(CATEGORIES_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(CATEGORIES_UPDATED)
	},

	watch: {
		$route(to, from) {
			this.$fetch()
		},
	},
})

</script>