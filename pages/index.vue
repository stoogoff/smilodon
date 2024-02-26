<template>
	<div>
		<h1>Smilodon</h1>

		<p>General purpose welcome page</p>
		<p>Could have some small dashboard links if the user has already been here</p>

		<div class="m-4">
			<d-alert class="my-4" info>Info</d-alert>
			<d-alert class="my-4" success>Success</d-alert>
			<d-alert class="my-4" warning>Warning</d-alert>
			<d-alert class="my-4" error>Error</d-alert>
		</div>

		<div class="m-4">
			<d-button info>Info</d-button>
			<d-button success>Success</d-button>
			<d-button warning>Warning</d-button>
			<d-button error>Error</d-button>
			<d-button outline info>Info</d-button>
			<d-button outline success>Success</d-button>
			<d-button outline warning>Warning</d-button>
			<d-button outline error>Error</d-button>
		</div>

		<div class="m-4">
			<d-button primary>Primary</d-button>
			<d-button secondary>Secondary</d-button>
			<d-button accent>Accent</d-button>
			<d-button neutral>Neutral</d-button>
			<d-button outline primary>Primary</d-button>
			<d-button outline secondary>Secondary</d-button>
			<d-button outline accent>Accent</d-button>
			<d-button outline neutral>Neutral</d-button>
		</div>

		<div class="m-4">
			<d-badge primary>Primary</d-badge>
			<d-badge secondary>Secondary</d-badge>
			<d-badge accent>Accent</d-badge>
			<d-badge neutral>Neutral</d-badge>
			<d-badge ghost>Ghost</d-badge>
			<d-badge info>Info</d-badge>
			<d-badge success>Success</d-badge>
			<d-badge warning>Warning</d-badge>
			<d-badge error>Error</d-badge>
		</div>

	</div>
</template>
<script>

import { required } from 'vue-daisy-ui/utils/validators'

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

		this.categories = await this.$categories.allByProject('seed-1')
		this.selection = this.categories[0]

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
			categories: [],
			text: '',
			checkbox: true,
			radio: 'Radio 1',
			selection: null,
			swapper: true,
		}
	},

	computed: {
		rules() {
			return [required()]
		},
		selectionTitle() {
			return this.selection ? this.selection.title : ''
		}
	},

	methods: {
		clicky() {
			alert('clicky')
		},
	},
}

</script>