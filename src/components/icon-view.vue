<template>
	<d-icon :icon="iconActual" />
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
	},

	computed: {
		iconActual() {
			return getIcon(this.icon)
		},
	},
})

</script>