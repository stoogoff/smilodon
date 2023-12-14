<template>
	<button class="btn" @click="$emit('click')" :disabled="disabled"><slot /></button>
</template>
<script>

import Vue from 'vue'

export default Vue.component('duiButton', {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
})

</script>