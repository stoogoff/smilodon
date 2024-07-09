<template>
	<div class="prose" v-html="parsedContent" />
</template>
<script>
import Vue from 'vue'
import { markdown } from '~/utils/string'

export default Vue.component('Markdown', {
	props: {
		content: {
			type: String,
			required: true,
		},
	},

	computed: {
		parsedContent() {
			return markdown(this.content)
		},
	},
})
</script>