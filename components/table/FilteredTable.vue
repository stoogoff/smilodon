<template>
	<div>
		<table class="w-full">
			<thead>
				<tr>
					<th
						class="text-left cursor-pointer"
						v-for="(column, idx) in columns"
						:key="`${ column }_${ idx }`"
					>
						{{ column }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="record in records"
					:key="record._id"
				>
					<slot name="row" v-bind:row="record">
						<td>{{ record.title }}</td>
					</slot>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>

import Vue from 'vue'

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

	/*data() {
		return {
			columns: []
		}
	},*/

	mounted() {
		//this.columns = this.$children
		console.log('children', this.$children)
		console.log('slots', this.$slots)
		console.log('scopedSlots', this.$scopedSlots)
		console.log('scopedSlots', this.$scopedSlots.row)
	},
})

</script>