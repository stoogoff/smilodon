<template>
	<td>
		<nuxt-link :to="to" class="link"><slot /></nuxt-link>
	</td>
</template>
<script>

import Vue from 'vue'

export default Vue.component('LinkColumn', {
	props: {
		to: {
			type: [String, Object],
			required: true,
		},
	},
})

</script>