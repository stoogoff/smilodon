<template>
	<li>
		<nuxt-link :to="entity.slug">
			<entity-icon :entity="entity" />
			<span class="hover:link hover:link-primary">{{ entity.title }}</span>
		</nuxt-link>
	</li>
</template>
<script>

import Vue from 'vue'
import { PROJECT_ID_PREFIX } from '~/utils/config'

export default Vue.component('EntityItem', {
	props: {
		entity: {
			type: Object,
			required: true,
		},
	},
})

</script>
