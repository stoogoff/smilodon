<template>
	<icon-view :icon="entity.icon || 'fileDocument'" />
</template>
<script>
import Vue from 'vue'

export default Vue.component('EntityIcon', {
	props: {
		entity: {
			type: Object,
			required: true,
		},
	},
})

</script>