<template>
	<li :class="{ 'bg-base-300': isActive }">
		<nuxt-link :to="element.slug">
			<element-icon :element="element" :class="{ 'text-primary': isActive }" />
			<span class="hover:link hover:link-primary">{{ element.title }}</span>
			<icon-view icon="alert" class="text-error" v-if="hasUnsavedChanges" />
		</nuxt-link>
	</li>
</template>
<script>

import Vue from 'vue'
import { local } from 'vue-daisy-ui/utils/storage'
import { PROJECT_ID_PREFIX } from '~/utils/config'

export default Vue.component('ElementItem', {
	props: {
		element: {
			type: Object,
			required: true,
		},
	},

	computed: {
		isActive() {
			return this.$route.fullPath === this.element.slug
		},

		hasUnsavedChanges() {
			return this.element ? local.has(this.element._id) : false
		},
	},
})

</script>
