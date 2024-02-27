<template>
	<filtered-table :records="records" :columns="columns" />
</template>
<script>
import Vue from 'vue'
import { unique, sortByProperty } from 'vue-daisy-ui/utils/list'
import { ENTITIES_UPDATED } from '~/utils/config'
import { notNull } from '~/utils/assert'

export default Vue.component('EntityTable', {
	props: {
		entities: {
			type: Array,
			required: true,
		},
	},

	async fetch() {
		const categories = await this.$categories.all()
		const idMap = {}
		let columns = []

		categories.forEach(category => idMap[category._id] = category)

		// map entities to records
		if(this.entities) {
			this.records = this.entities.map(row => {
				const properties = {}

				row.properties.forEach(prop => properties[prop.name] = prop.value)
				columns.push(Object.keys(properties))

				return {
					...properties,
					...row,
					tags: row.tags.join(', '),
					category: row.category in idMap ? idMap[row.category].title : 'Unkown',
				}
			})
		}

		columns = unique(columns.flatMap(c => c)).map(column => ({
			title: column,
			property: column,
			hidden: true,
		}))

		this.columns = [ ...this.columns, ...columns ]
	},
	fetchOnServer: false,

	data() {
		return {
			columns: [
				{ title: 'Title', property: 'title', link: 'slug' },
				{ title: 'Category', property: 'category' },
				{ title: 'Tags', property: 'tags' },
			],
			records: [],
		}
	},
})

</script>