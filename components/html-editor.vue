<template>
	<div>
		<client-only>
			<div class="font-sans font-semibold text-xs uppercase inline-block mb-2">{{ label }}</div>
			<vue-editor
				:value="value"
				:editor-toolbar="toolbar"
				@input="update" />
		</client-only>
	</div>
</template>
<script>

import Vue from 'vue'
import { EDITOR_TOOLBAR } from '~/utils/config'

export default Vue.component('HtmlEditor', {
	props: {
		label: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			default: '',
		},
	},

	computed: {
		toolbar() {
			return EDITOR_TOOLBAR
		},
	},

	methods: {
		update(text) {
			this.$emit('input', text)
		},
	},
})

</script>