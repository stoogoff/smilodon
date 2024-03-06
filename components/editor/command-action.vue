<template>
	<d-button sm @click="click" :disabled="!active">
		<icon-view :icon="icon" />
	</d-button>
</template>
<script>

import Vue from 'vue'

export default Vue.component('CommandAction', {
	props: {
		command: {
			type: Function,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			active: true,
		}
	},

	/*watch: {
		'view.state'(newValue) {
			this.active = this.command(this.view.state, null, this.view)
		},
	},*/

	methods: {
		click() {
			this.command()
		},
	},
})

</script>