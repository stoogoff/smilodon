<template>
	<d-button sm @click="click" :disabled="disabled" :neutral="highlight">
		<d-tooltip :title="tooltipActual">
			<icon-view :icon="icon" />
		</d-tooltip>
	</d-button>
</template>
<script>

import Vue from 'vue'
import { notEmptyString } from 'vue-daisy-ui/utils/assert'
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
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		tooltip: {
			type: String,
			default: '',
		},
	},

	computed: {
		tooltipActual() {
			if(notEmptyString(this.tooltip)) {
				return this.tooltip
			}

			switch(this.command) {
				case MARKS.CODE:
					return 'Code'
				case MARKS.STRONG:
					return 'Bold'
				case MARKS.EM:
					return 'Italic'
				case MARKS.LINK:
					return 'Insert link'
				case NODES.LIST_BULLET:
					return 'Bulleted list'
				case NODES.LIST_ORDERED:
					return 'Numbered list'
				case NODES.BLOCKQUOTE:
					return 'Quote'				
			}

			return ''
		}
	},

	methods: {
		click() {
			switch(this.command) {
				case MARKS.CODE:
				case MARKS.STRONG:
				case MARKS.EM:
				case MARKS.LINK:
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