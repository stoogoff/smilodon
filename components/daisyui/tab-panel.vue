<template>
	<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
		<slot />
	</div>
</template>
<script>

import Vue from 'vue'
import  { createId } from 'we-ui/utils/string'

export default Vue.component('duiTabPanel', {
	props: {
		title: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			key: createId(),
		}
	},
})

</script>