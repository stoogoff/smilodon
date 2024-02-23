<template>
	<d-icon :icon="icon" />
</template>
<script>
import Vue from 'vue'
import { getIcon } from '~/utils/icons'

export default Vue.component('EntityIcon', {
	props: {
		entity: {
			type: Object,
			required: true,
		},
	},

	computed: {
		icon() {
			return getIcon(this.entity.icon)
		},
	},
})

</script>