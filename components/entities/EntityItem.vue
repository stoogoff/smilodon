<template>
	<li class="flex cursor-pointer hover:bg-gray-100">
		<we-icon-view class="inline-block w-5 text-gray-600 mr-1" :icon="icon" />
		<nuxt-link class="flex-grow" :to="entity.slug">{{ entity.title }}</nuxt-link>
	</li>
</template>
<script>

import Vue from 'vue'
import { getIcon, fileDocument } from '~/utils/icons'
import { PROJECT_ID_PREFIX } from '~/utils/config'

export default Vue.component('EntityItem', {
	props: {
		entity: {
			type: Object,
			required: true,
		},
	},

	computed: {
		icon() {
			return this.entity.icon ? getIcon(this.entity.icon) : fileDocument
		},
	},
})

</script>
