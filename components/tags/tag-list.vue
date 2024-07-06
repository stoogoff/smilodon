<template>
	<div>
		<d-badge
			v-for="tag in tags"
			:key="`tag_list_${ tag }`"
			info
		>{{ tag }}</d-badge>
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('TagList', {
	props: {
		tags: {
			type: Array,
			required: true,
		},
	},
})

</script>