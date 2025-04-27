<template>
	<div>
		<d-badge class="mr-2 p-4" error
			v-for="(tag, index) in tags"
			:key="`${ slugify(tag) }_${ index }`"
		>
			<span class="inline-block" @click="deleteTag(tag, index)">
				{{ tag }} <icon-view md icon="trash" class="-mb-1" />
			</span>
		</d-badge>
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
			this.$emit('delete', tag, index)
		}
	},
})

</script>