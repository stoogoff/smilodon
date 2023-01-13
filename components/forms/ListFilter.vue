<template>
	<text-input :label="label" v-model="filter" @append="clear" >
		<template #append>
			<icon-view icon="close" />
		</template>
	</text-input>
</template>
<script>
import Vue from 'vue'

export default Vue.component('ListFilter', {
	props: {
		list: {
			type: Array,
			default: [],
		},
		property: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: 'Filter',
		},
	},

	data() {
		return {
			filter: '',
		}
	},

	watch: {
		filter(text) {
			text = text.toLowerCase()

			const list = this.list.filter(a =>
				a[this.property]
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase()
					.indexOf(text) != -1)

			this.$emit('filter', list)
		}
	},

	methods: {
		clear() {
			this.filter = ''
		}
	},
})
</script>