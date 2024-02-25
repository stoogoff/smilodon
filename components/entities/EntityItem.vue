<template>
	<li>
		<nuxt-link :to="entity.slug">
			<d-icon :icon="icon" />
			{{ entity.title }}
		</nuxt-link>
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
			return getIcon(this.entity.icon)
		},
	},
})

</script>
