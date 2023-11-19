<template>
	<section>
		<we-loading-spinner v-if="category === null" />
		<div v-else>
			<h1>Category: {{ category.title }}</h1>
			<div>
				<span @click="setViewToTable" class="cursor-pointer hover:bg-gray-200 p-1 rounded">
					<we-icon-view class="inline-block w-5" :icon="tableIcon" />
				</span>
				<span @click="setViewToMap" class="cursor-pointer hover:bg-gray-200 p-1 rounded">
					<we-icon-view class="inline-block w-5" :icon="earthIcon" />
				</span>
			</div>
			<div v-if="hasEntities">
				<entity-table v-if="showTable" :entities="entities" />
				<p v-else>Show map here</p>
			</div>
		</div>
	</section>
</template>
<script>

import WithEntities from '~/mixins/with-entities'
import { table, earth } from '~/utils/icons'

const VIEW_TABLE = 'table'
const VIEW_MAP = 'map'

export default {
	name: 'CategoryView',
	mixins: [ WithEntities ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.entities = await this.$entities.allByCategory(params.categoryId)
		this.category = await this.$categories.byId(params.categoryId)
	},
	fetchOnServer: false,

	data() {
		return {
			category: null,
			view: VIEW_TABLE
		}
	},

	computed: {
		showTable() {
			return this.view === VIEW_TABLE
		},

		tableIcon() {
			return table
		},

		earthIcon() {
			return earth
		},
	},

	methods: {
		setViewToTable() {
			this.view = VIEW_TABLE
		},

		setViewToMap() {
			this.view = VIEW_MAP
		},
	},
}

</script>
