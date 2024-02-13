<template>
	<div>
		<h1>Smilodon</h1>

		<p>General purpose welcome page</p>
		<p>Could have some small dashboard links if the user has already been here</p>

		<d-button primary @click="clicky">Primary</d-button>
		<d-button secondary @click="clicky">Secondary</d-button>
		<d-button disabled @click="clicky">Disabled</d-button>

		<d-accordion arrow group="group1">
			<template #title>
				One
			</template>
			<p>Hello group 1</p>
		</d-accordion>
		<d-accordion arrow group="group1">
			<template #title>
				Two
			</template>
			<p>Hola group 1</p>
		</d-accordion>

		<hr />

		<d-accordion plus group="group2">
			<template #title>
				One
			</template>
			<p>Hello group 2</p>
		</d-accordion>
		<d-accordion plus group="group2">
			<template #title>
				Two
			</template>
			<p>Hola group 2</p>
		</d-accordion>

		<d-badge success lg>Hello</d-badge>
		<d-tooltip primary title="Hello"><d-badge info md>Hello</d-badge></d-tooltip>

		<d-toast start bottom><d-alert warning>Alert</d-alert></d-toast>
		<d-tooltip accent title="This will load forever"><d-loading infinity /></d-tooltip>
		<d-loading dots lg class="text-error" />
		<d-progress accent :value="50" :max="100" class="w-56" />
		<d-progress secondary class="w-56" />
		<d-radial-progress :percent="35" class="bg-primary text-primary-content border-4 border-primary" />
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