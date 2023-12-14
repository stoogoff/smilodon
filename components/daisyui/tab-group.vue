<template>
	<div role="tablist" class="tabs">
		<input
			v-for="tab in tabs"
			type="radio"
			:name="tab.key"
			role="tab"
			class="tab"
			:aria-label="tab.title" />
		<slot />
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('duiTabGroup', {
	data() {
		return {
			tabs: []
		}
	},

	mounted() {
		this.tabs = this.$children
	}
})

</script>