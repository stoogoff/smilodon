<template>
	<ul>
		<category-item
			v-for="category in categories"
			:key="category._id"
			:category="category"
		/>
	</ul>	
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'we-ui/utils/list'
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
		const categories = await this.$categories.allWithParent(this.parent)

		this.categories = categories.sort(sortByProperty('title'))
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
		}
	},

	mounted() {
		EventBus.$on(CATEGORIES_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(CATEGORIES_UPDATED)
	},
})

</script>