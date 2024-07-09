<template>
	<d-screen-slide>
		<d-navbar class="bg-primary">
			<d-navbar-start>
				<h1 class="text-md">Create Element</h1>
			</d-navbar-start>
			<d-navbar-end>
				<d-button @click="$emit('close')" sm>
					<icon-view icon="close" />
					Close
				</d-button>
			</d-navbar-end>
		</d-navbar>
		<element-editor @save="save" />
	</d-screen-slide>
</template>
<script>

import Vue from 'vue'
import { ELEMENTS_UPDATED } from '~/utils/config'

export default Vue.component('ElementOverlay', {
	methods: {
		async save(element) {
			this.$emit('close', element)
		},
	},
})
</script>