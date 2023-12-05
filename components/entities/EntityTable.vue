<template>
	<div>


		Columns
		<ul>
			<li v-for="(column, idx) in editableColumns" :key="idx">
				<we-check-box
					:label="column"
					:value="isSelectedColumn(column)"
					@input="toggleSelectedColumn(column)" />
			</li>
		</ul>

		<filtered-table
			:records="entities"
			:columns="['Title', ...displayColumns]"
			v-slot:row="{ row }"
		>
			<link-column :to="row.slug">{{ row.title }}</link-column>
			<base-column
				v-for="(column, idx) in displayColumns"
				v-if="isSelectedColumn(column)"
				:key="`${ column }_${ idx }`"
			>
				{{ getColumnValue(row, column) }}
			</base-column>
		</filtered-table>

		<!-- table class="w-full">
			<thead>
				<tr>
					<th class="text-left cursor-pointer" @click="sortByColumn('Title')">Title</th>
					<th
						v-for="(column, idx) in displayColumns"
						v-if="isSelectedColumn(column)"
						:key="`${ column }_${ idx }`"
						class="text-left cursor-pointer"
						@click="sortByColumn(column)"
					>
						{{ column }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="entity in sortedEntities" :key="entity._id">
					<link-column :to="entity.slug" header="Title">{{ entity.title }}</link-column>
					<text-column
						v-for="(column, idx) in displayColumns"
						v-if="isSelectedColumn(column)"
						:key="`${ column }_${ idx }`"
						:header="column"
					>
						{{ getColumnValue(entity, column) }}
					</text-column>
				</tr>
			</tbody>
		</table -->
	</div>
</template>
<script>
import Vue from 'vue'
import { unique, sortByProperty } from 'we-ui/utils/list'
import { ENTITIES_UPDATED } from '~/utils/config'
import { notNull } from '~/utils/assert'
import TagList from '~/components/TagList.vue'

// sort by column
// add columns from different properties

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

		categories.forEach(category => idMap[category._id] = category)

		this.categories = idMap
	},
	fetchOnServer: false,

	data() {
		return {
			categories: {},
			selectedColumns: ['Category', 'Tags'],
			sorting: {
				name: 'Title',
				direction: true,
			},
			sortedEntities: [],
		}
	},

	mounted() {
		if(this.entities) {
			this.sortedEntities = this.entities.sort(sortByProperty(this.sorting.name))
		}
	},

	computed: {
		editableColumns() {
			const propertyColumns = this.entities
				.flatMap(({ properties }) => properties.map(({ name }) => name))

			return ['Category', 'Tags', ...unique(propertyColumns)]
		},

		displayColumns() {
			return this.selectedColumns.sort()
		},
	},

	methods: {
		isSelectedColumn(column) {
			return this.selectedColumns.includes(column)
		},

		toggleSelectedColumn(column) {
			if(this.isSelectedColumn(column)) {
				this.selectedColumns = [...this.selectedColumns.filter(col => col !== column)]
			}
			else {
				this.selectedColumns = [...this.selectedColumns, column]
			}
		},

		getColumnValue(entity, column) {
			switch(column) {
				case 'Title':
					return entity.title

				case 'Category':
					return this.getCategoryTitle(entity.category)

				case 'Tags':
					return [ ...entity.tags ].sort().join(', ')
					/*const tagListInstance = Vue.extend(TagList)
					return new tagListInstance({
						propsData: {
							tags: entity.tags,
						},
					})*/

				default:
					const value = entity.properties.find(({ name }) => name === column)

					return notNull(value) ? value.value : 'Unknown'
			}

			return 'n/a'
		},

		getCategoryTitle(categoryId) {
			if(!categoryId) return 'None'
			if(!(categoryId in this.categories)) return 'Unknown'

			return this.categories[categoryId].title
		},

		sortByColumn(column) {
			console.log('INPUT')
			console.log(column, this.sorting.name)
			console.log('direction=', this.sorting.direction)

			if(this.sorting.name === column) {
				console.log('matching name, switching direction')
				this.sorting.direction = !this.sorting.direction
			}
			else {
				console.log('new sort')
				this.sorting.name = column
				this.sorting.direction = true
			}

			console.log('AFTER')
			console.log(column, this.sorting.name)
			console.log('direction=', this.sorting.direction)

			let sortedEntities = this.entities.sort(sortByProperty(column))

			if(!this.sorting.direction) {
				console.log('reversing direction')
				sortedEntities = sortedEntities.reverse()
			}

			console.log(sortedEntities.map(e => e.title))

			this.sortedEntities = [ ...sortedEntities ]
		},
	},
})

</script>