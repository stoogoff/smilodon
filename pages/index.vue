<template>
	<div>
		<h1>Smilodon</h1>

		<p>General purpose welcome page</p>
		<p>Could have some small dashboard links if the user has already been here</p>


		<filtered-table :records="records" :columns="columns" v-slot:row="{ row }">
			<link-column header="Title" :to="row.slug">
				{{ row.title }}
			</link-column>
			<base-column header="Category">
				{{ row.category }}
			</base-column>
			<base-column header="Volume">
				{{ row.Volume }}
			</base-column>
		</filtered-table>

		<!-- filtered-table :records="records" :columns="columns" / -->
	</div>
</template>
<script>

export default {
	name: 'Index',
	layout: 'site',

	async fetch() {
		const records = await this.$entities.all()

		this.records = records.map(row => {
			const properties = {}

			row.properties.forEach(prop => properties[prop.name] = prop.value)

			return {
				...properties,
				...row,
			}
		})

		console.log(this.records)
	},
	fetchOnServer: false,

	data() {
		return {
			columns: [
				'Title',
				'Category',
				'Volume',
			],
			records: [],
		}
	},
}

</script>