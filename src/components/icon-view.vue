<template>
	<d-icon :icon="iconActual" :sm="sm" :lg="lg" :x-lg="xLg" />
</template>
<script>

import Vue from 'vue'
import{ getIcon } from '~/utils/icons'

export default Vue.component('IconView', {
	props: {
		icon: {
			type: String,
			required: true,
		},
		sm: {
			type: Boolean,
			default: false,
		},
		lg: {
			type: Boolean,
			default: false,
		},
		xLg: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		iconActual() {
			return getIcon(this.icon)
		},
	},
})

</script>