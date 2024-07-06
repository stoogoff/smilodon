<template>
	<div>
		<div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
			<label for="table-search" class="sr-only">Search</label>
			<label class="input input-bordered input-sm flex items-center gap-2">
				<svg class="w-4 h-4 opacity-70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
					</svg>
				<input v-model="search" type="text" id="table-search" class="grow" placeholder="Search">
			</label>
			<popup-button y="top" x="right">
				Columns <small class="inline-block pl-1">({{ activeColumns }} of {{ mutableColumns.length }})</small>
				<template #popup>
					<ul>
						<li v-for="column in mutableColumns" :key="`checkbox_${ column.key }`">
							<label>
								<d-checkbox
									sm
									:value="!column.hidden"
									:disabled="!canToggle(column)"
									@input="toggleSelectedColumn(column)" />
								{{ column.title }}
							</label>
						</li>
					</ul>
				</template>
			</popup-button>
		</div>

		<table class="table">
			<thead>
				<tr class="bg-base-200">
					<th
						class="cursor-pointer uppercase hover:link-primary"
						v-for="column in mutableColumns"
						:key="`th_${ column.key }`"
						v-if="!column.hidden"
						@click="sortColumn(column)"
					>
						<div class="flex items-center">
							{{ column.title }}
							<svg class="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
							</svg>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="record in mutableRecords"
					:key="record._id"
					class="hover:bg-base-200"
				>
					<slot name="row" v-bind:row="record">
						<td
							v-for="column in mutableColumns"
							:key="`td_${ column.key }`"
							v-if="!column.hidden"
						>
							<nuxt-link class="link hover:link-primary" :to="record[column.link]" v-if="column.link">
								{{ record[column.property] }}
							</nuxt-link>
							<span v-else>{{ column.property in record ? record[column.property] : 'n/a' }}</span>
						</td>
					</slot>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import Table from '~/managers/table'
import { notNull } from '~/utils/assert'
import { searchObject } from '~/utils/string'

export default Vue.component('FilteredTable', {
	props: {
		records: {
			type: Array,
			default: [],
		},
		columns: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			id: location.pathname,
			mutableColumns: [],
			mutableRecords: [],
			search: '',
		}
	},

	watch: {
		columns() {
			this.createMutableColumns()
		},

		records() {
			this.createMutableRecords()
		},

		search(text) {
			this.createMutableRecords()
		},
	},

	computed: {
		activeColumns() {
			return this.mutableColumns.filter(({ hidden }) => !hidden).length
		},
	},

	methods: {
		createMutableColumns() {
			this.mutableColumns = Table.createColumns(this.id, this.columns)
		},

		createMutableRecords() {
			if(this.search === '') {
				this.mutableRecords = [ ...this.records ]
			}
			else {
				this.mutableRecords = [ ...this.records.filter(row => searchObject(row, this.search)) ]
			}

			for(let i = 0, len = this.mutableColumns.length; i < len; ++i) {
				if(notNull(this.mutableColumns[i].sort)) {
					this.sortByColumn(this.mutableColumns[i])
					break
				}
			}
		},

		canToggle(column) {
			// can always toggle a hidden column
			if(column.hidden) return true

			const notHidden = this.mutableColumns.filter(({ hidden }) => !hidden)

			// can always toggle if there's more than one selected
			// or we've somehow deselected everything
			if(notHidden.length > 1 || notHidden.length === 0) return true

			// don't allow toggling if this is the last column available
			return notHidden[0].key !== column.key
		},

		toggleSelectedColumn(column) {
			column.hidden = !column.hidden

			Table.saveColumnState(this.id, this.mutableColumns)
		},

		sortColumn(column) {
			column.sort = column.sort === null ? true : !column.sort
			this.mutableColumns.filter(col => col !== column).forEach(col => col.sort = null)

			this.sortByColumn(column)

			Table.saveColumnState(this.id, this.mutableColumns)
		},

		sortByColumn(column) {
			let sorted = this.mutableRecords.sort(sortByProperty(column.property))

			if(column.sort === false) sorted.reverse()

			this.mutableRecords = [ ...sorted ]
		},
	},
})

</script>