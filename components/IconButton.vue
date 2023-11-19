<template>
	<span class="cursor-pointer hover:bg-gray-200 p-1 rounded" @click="$emit('click')">
		<we-icon-view class="inline-block w-5" :icon="icon" />
	</span>
</template>
<script>

import Vue from 'vue'

export default Vue.component('IconButton', {
	props: {
		icon: {
			type: String,
			required: true,
		},
	},
})

</script>