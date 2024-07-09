<template>
	<icon-view :icon="element.icon || 'fileDocument'" />
</template>
<script>
import Vue from 'vue'

export default Vue.component('ElementIcon', {
	props: {
		element: {
			type: Object,
			required: true,
		},
	},
})

</script>