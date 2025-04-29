<template>
	<d-screen-slide>
		<d-navbar class="bg-neutral">
			<d-navbar-start>
				<h1 class="text-neutral-content">Create Element</h1>
			</d-navbar-start>
			<d-navbar-end>
				<d-button sm neutral @click="$emit('cancel')">
					<icon-view icon="close" />
					Close
				</d-button>
			</d-navbar-end>
		</d-navbar>
		<element-editor overlay @save="save" @cancel="$emit('cancel')" />
	</d-screen-slide>
</template>
<script>

import Vue from 'vue'
import { ELEMENTS_UPDATED } from '~/utils/config'

export default Vue.component('ElementOverlay', {
	methods: {
		save(element) {
			this.$emit('save', element)
		},
	},
})
</script>