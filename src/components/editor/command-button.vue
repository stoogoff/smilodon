<template>
	<d-button sm @click="click" :disabled="!active" :neutral="highlight">
		<icon-view :icon="icon" />
	</d-button>
</template>
<script>

import Vue from 'vue'
import { MARKS, NODES } from './config'

export default Vue.component('CommandButton', {
	props: {
		editor: {
			type: Object,
			required: true,
		},
		command: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		highlight: {
			type: Boolean,
			default: false,
		}
	},

	data() {
		return {
			active: true,
		}
	},

	methods: {
		click() {
			switch(this.command) {
				case MARKS.CODE:
				case MARKS.STRONG:
				case MARKS.EM:
					this.editor.toggle(this.command)
					break

				case NODES.LIST_BULLET:
				case NODES.LIST_ORDERED:
				case NODES.BLOCKQUOTE:
					this.editor.wrap(this.command)
					break

				default:
					this.editor.block(this.command)
			}
		},
	},
})

</script>