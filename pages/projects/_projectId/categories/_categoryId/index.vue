<template>
	<section>
		<loading-spinner v-if="category === null" />
		<div v-else>
			<breadcrumb />
			<d-card class="bg-base-100 shadow">
				<d-card-title>
					Category: {{ category.title }}
				</d-card-title>
				<div>
					<d-button sm @click="setViewToTable">
						<icon-view icon="table" />
					</d-button>
					<d-button sm @click="setViewToMap">
						<icon-view icon="earth" />
					</d-button>
				</div>
				<div v-if="hasEntities">
					<entity-table v-if="showTable" :entities="entities" />
					<entity-map v-else :category="category" />
				</div>
			</d-card>
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
			view: VIEW_TABLE,
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
