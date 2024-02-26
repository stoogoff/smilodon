<template>
	<d-screen-slide>
		<d-navbar class="bg-primary">
			<d-navbar-start>
				<h1 class="text-md">Create Entity</h1>
			</d-navbar-start>
			<d-navbar-end>
				<d-button @click="$emit('close')" sm>
					<d-icon :icon="closeIcon" />
					Close
				</d-button>
			</d-navbar-end>
		</d-navbar>
		<entity-editor @save="save" />
	</d-screen-slide>
</template>
<script>

import Vue from 'vue'
import { ENTITIES_UPDATED } from '~/utils/config'
import { close } from '~/utils/icons'

export default Vue.component('EntityOverlay', {
	computed: {
		closeIcon() {
			return close
		},
	},

	methods: {
		async save(entity) {
			this.$emit('close')
		},
	},
})
</script>