<template>
	<span class="inline-block w-5"><we-icon-view :icon="icon" /></span>
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