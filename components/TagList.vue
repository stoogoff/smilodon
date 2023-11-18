<template>
	<div>
		<tag-view
			v-for="(tag, index) in tags"
			:key="`${slugify(tag)}_${index}`"
			:tag="tag" />
	</div>
</template>
<script>

import Vue from 'vue'
import { slugify } from '~/utils/string'

export default Vue.component('TagList', {
	props: {
		tags: {
			type: Array,
			required: true,
		},
	},

	methods: {
		slugify(tag) {
			return slugify(tag)
		},
	},
})

</script>