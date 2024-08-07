
import Vue from 'vue'
import { isIn, notIn, throwIfNull } from 'vue-daisy-ui/utils/assert'
import { local } from 'vue-daisy-ui/utils/storage'
import { createId } from 'vue-daisy-ui/utils/string'

const state = Vue.observable({
	columns: {},
})

export default {
	createColumns(id, columns) {
		throwIfNull(id, 'id')

		if(local.has(id) && notIn(id, state.columns)) return this.loadColumnState(id)
		if(isIn(id, state.columns)) return state.columns[id]

		const mappedColumns = (columns || []).map(column => ({
			key: createId(),
			hidden: false,
			sort: null,
			...column
		}))

		this.saveColumnState(id, mappedColumns)

		return mappedColumns
	},

	saveColumnState(id, columns) {
		local.set(id, columns)
		state.columns[id] = columns
	},

	loadColumnState(id) {
		state.columns[id] = local.get(id)

		return state.columns[id]
	},
}
