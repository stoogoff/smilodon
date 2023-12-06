<template>
	<div>

		Columns
		<ul>
			<li v-for="column in mutableColumns" :key="`checkbox_${ column.key }`">
				<we-check-box
					:label="column.title"
					:value="!column.hidden"
					@input="toggleSelectedColumn(column)" />
			</li>
		</ul>

		<table class="w-full">
			<thead>
				<tr class="bg-gray-100 rounded">
					<th
						class="text-left cursor-pointer px-4 py-1"
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
					class="border-b border-gray-300 last:border-0"
				>
					<slot name="row" v-bind:row="record">
						<td
							v-for="column in mutableColumns"
							:key="`td_${ column.key }`"
							v-if="!column.hidden"
							class="px-4 py-2"
						>
							<nuxt-link class="link" :to="record[column.link]" v-if="column.link">
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
import { createId } from 'we-ui/utils/string'
import { sortByProperty } from 'we-ui/utils/list'

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
			mutableColumns: [],
			mutableRecords: [],
		}
	},

	watch: {
		columns() {
			this.createMutableColumns()
		},

		records() {
			this.createMutableRecords()
		},
	},

	methods: {
		createMutableColumns() {
			this.mutableColumns = this.columns.map(column => ({
				key: createId(),
				hidden: false,
				sort: null,
				...column
			}))
		},

		createMutableRecords() {
			this.mutableRecords = [ ...this.records ]
		},

		toggleSelectedColumn(column) {
			column.hidden = !column.hidden
		},

		sortColumn(column) {
			column.sort = column.sort === null ? true : !column.sort

			let sorted = this.mutableRecords.sort(sortByProperty(column.property))

			if(column.sort === false) sorted.reverse()

			this.mutableRecords = [ ...sorted ]
		},
	},
})

</script>