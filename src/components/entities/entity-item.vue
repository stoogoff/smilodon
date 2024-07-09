<template>
	<li :class="{ 'bg-base-300': isActive }">
		<nuxt-link :to="entity.slug">
			<entity-icon :entity="entity" :class="{ 'text-primary': isActive }" />
			<span class="hover:link hover:link-primary">{{ entity.title }}</span>
			<icon-view icon="alert" class="text-error" v-if="hasUnsavedChanges" />
		</nuxt-link>
	</li>
</template>
<script>

import Vue from 'vue'
import { PROJECT_ID_PREFIX } from '~/utils/config'
import { local } from '~/utils/storage'

export default Vue.component('EntityItem', {
	props: {
		entity: {
			type: Object,
			required: true,
		},
	},

	computed: {
		isActive() {
			return this.$route.fullPath === this.entity.slug
		},

		hasUnsavedChanges() {
			return this.entity ? local.has(this.entity._id) : false
		},
	},
})

</script>
