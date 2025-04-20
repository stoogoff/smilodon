<template>
	<filtered-table :records="records" :columns="columns" />
</template>
<script>
import Vue from 'vue'
import { isNull, notNull, isEmptyString } from 'vue-daisy-ui/utils/assert'
import { unique, sortByProperty } from 'vue-daisy-ui/utils/list'
import { ELEMENTS_UPDATED } from '~/utils/config'

export default Vue.component('ElementTable', {
	props: {
		elements: {
			type: Array,
			required: true,
		},
	},

	async fetch() {
		const categories = await this.$categories.all()
		const idMap = {}
		let columns = []

		categories.forEach(category => idMap[category._id] = category)

		const buildCategoryPath = (id, output = []) => {
			if(isEmptyString(id)) return output

			const category = idMap[id]

			if(isNull(category)) return [...output, 'Unknown']

			return [...buildCategoryPath(category.parent, output), category.title]
		}

		// map elements to records
		if(this.elements) {
			this.records = this.elements.map(row => {
				const properties = {}

				row.properties.forEach(prop => properties[prop.name] = prop.value)
				columns.push(Object.keys(properties))

				return {
					...properties,
					...row,
					tags: row.tags.join(', '),
					category: buildCategoryPath(row.category).join(' / '),
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