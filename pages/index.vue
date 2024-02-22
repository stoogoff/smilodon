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
			<template #title class="text-primary">
				Two
			</template>
			<p>Hola group 1</p>
		</d-accordion>

		<hr />

		<d-form-control label="Checkbox"><d-checkbox v-model="checkbox" primary /></d-form-control>
		<d-form-control label="Greeting"><d-input v-model="text" bordered error placeholder="Hello" /></d-form-control>
		<d-form-control label="Password"><d-input v-model="text" type="password" bordered placeholder="Password" /></d-form-control>
		<d-form-control label="Number"><d-input v-model="text" type="number" bordered placeholder="Number" /></d-form-control>
		<d-form-control label="Disabled"><d-input v-model="text" bordered info lg disabled placeholder="No" /></d-form-control>

		<d-stats class="shadow m-4" vertical>
			<d-stat>
				<d-stat-title>Strength</d-stat-title>
				<d-stat-value class="text-primary">{{ text }}</d-stat-value>
				<d-stat-description>How strong you are</d-stat-description>
			</d-stat>
			<d-stat>
				<d-stat-title>Intelligence</d-stat-title>
				<d-stat-value class="text-secondary">{{ checkbox }}</d-stat-value>
				<d-stat-description>How smart you are</d-stat-description>
			</d-stat>
		</d-stats>

		<hr />

		<ul>
			<li><label><input type="radio" name="radio" value="Radio 1" v-model="radio"> Radio 1</label></li>
			<li><label><input type="radio" name="radio" value="Radio 2" v-model="radio"> Radio 2</label></li>
			<li><label><input type="radio" name="radio" value="Radio 3" v-model="radio"> Radio 3</label></li>
			<li><h3>{{ radio }}</h3></li>
		</ul>

		<ul>
			<li><d-form-control label="Radio 1"><d-radio name="radio2" content="Radio 1" v-model="radio" /></d-form-control></li>
			<li><d-form-control label="Radio 2"><d-radio name="radio2" content="Radio 2" v-model="radio" /></d-form-control></li>
			<li><d-form-control label="Radio 3"><d-radio name="radio2" content="Radio 3" v-model="radio" /></d-form-control></li>
			<li><h3>{{ radio }}</h3></li>
		</ul>

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
			text: '',
			checkbox: true,
			radio: 'Radio 1',
		}
	},

	methods: {
		clicky() {
			alert('clicky')
		},
	},
}

</script>