<template>
	<span
		class="inline-block px-2 py-1 mr-1 bg-gray-200 text-gray-800 rounded relative"
		:class="{ 'tag-editable': editable }"
	>
		{{ tag }}
		<span
			v-if="editable"
			@click="deleteTag"
			class="inline-block cursor-pointer border-l border-gray-400 text-gray-600 absolute right-0 hover:bg-gray-300 hover:text-gray-800"
		>
			<we-icon-view class="inline-block" :icon="closeIcon" />
		</span>
	</span>
</template>
<script>

import Vue from 'vue'
import { close } from '~/utils/icons'

export default Vue.component('TagView', {
	props: {
		tag: {
			type: String,
			required: true,
		},
		editable: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		closeIcon() {
			return close
		},
	},

	methods: {
		deleteTag() {
			if(!this.editable) return

			this.$emit('delete', this.tag)
		},
	},
})

</script>
<style>
.tag-editable {
	@apply pr-8;
}
</style>
