<template>
	<span class="tag">{{ tag }}</span>
</template>
<script>

import Vue from 'vue'

export default Vue.component('TagView', {
	props: {
		tag: {
			type: String,
			required: true,
		},
	},
})

</script>