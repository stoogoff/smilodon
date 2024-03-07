<template>
	<d-button sm @click="click" :disabled="!active">
		<icon-view :icon="icon" />
	</d-button>
</template>
<script>

import Vue from 'vue'

export default Vue.component('CommandButton', {
	props: {
		editor: {
			type: Object,
			required: true,
		},
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
			active: false,
		}
	},

	watch: {
		'editor.state'(newValue) {
			this.active = this.command(this.editor.state, null, this.editor)
		},
	},

	methods: {
		click() {
			this.editor.focus()
			this.command(this.editor.state, this.editor.dispatch, this.editor)
		},
	},
})

</script>