<template>
	<div>
		<tag-view
			v-for="(tag, index) in tags"
			:key="`${ slugify(tag) }_${ index }`"
			:tag="tag"
			editable @delete="deleteTag(tag, index)" />
	</div>
</template>
<script>

import Vue from 'vue'
import { slugify } from 'vue-daisy-ui/utils/string'

export default Vue.component('TagEditor', {
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

		deleteTag(tag, index) {
			if(!this.editable) return

			this.$emit('delete', tag, index)
		}
	},
})

</script>