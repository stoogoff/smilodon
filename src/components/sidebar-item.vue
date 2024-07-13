<template>
	<li>
		<nuxt-link :to="to" class="flex pr-0">
			<span class="flex-1">{{ title }}</span>
			<d-tooltip :title="title" right>
				<icon-view class="flex-initial flex-end" :icon="icon" lg />
			</d-tooltip>
		</nuxt-link>
	</li>
</template>
<script>

import Vue from 'vue'

export default Vue.component('SidebarItem', {
	props: {
		to: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},
})

</script>