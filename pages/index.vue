<template>
	<div>
		<h1>Smilodon</h1>

		<p>General purpose welcome page</p>
		<p>Could have some small dashboard links if the user has already been here</p>

		<dui-button class="btn-secondary" @click="clicky">Button</dui-button>

		<!-- div role="tablist" class="tabs tabs-bordered" -->
		<dui-tab-group class="tabs-bordered">
			<dui-tab-panel title="Tab 1">Tab content 1</dui-tab-panel>
			<dui-tab-panel title="Tab 2">Tab content 2</dui-tab-panel>
			<dui-tab-panel title="Tab 3">Tab content 3</dui-tab-panel>
		</dui-tab-group>

		<filtered-table :records="records" :columns="columns" />
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
				{ title: 'Title', property: 'title', link: 'slug' },
				{ title: 'Category', property: 'category' },
				{ title: 'Volume', property: 'Volume' },
			],
			records: [],
		}
	},

	methods: {
		clicky() {
			alert('clicky')
		},
	},
}

</script>