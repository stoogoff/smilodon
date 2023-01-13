<template>
	<aside class="alert" :class="type">
		<span class="mr-2"><icon-view :icon="icon" v-if="icon" /></span>
		<span><slot /></span>
	</aside>
</template>
<script>
import Vue from 'vue'

export default Vue.component('AlertView', {
	props: {
		type: {
			type: String,
			required: true,
		},

		customIcon: {
			type: String,
			default: '',
		},
	},

	computed: {
		icon() {
			if(this.customIcon) return this.customIcon
			if(this.type === 'primary' || this.type === 'secondary') return 'info'

			return this.type
		},
	},
})
</script>