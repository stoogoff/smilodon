<template>
	<we-screen-slide>
		<we-navbar>
			<template #title>
				Publish
			</template>
			<template #buttons>
				<we-nav-button icon="close" @click="$emit('close')" />
			</template>
			<div class="hidden md:flex md:flex-row md:ml-auto relative">
				<nav-item :icon="closeIcon" @click="$emit('close')">Close</nav-item>
			</div>
		</we-navbar>
		<entity-editor @save="save" />
	</we-screen-slide>
</template>
<script>

import Vue from 'vue'
import { EventBus } from '~/utils/event-bus'
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
			EventBus.$emit(ENTITIES_UPDATED, entity)
			this.$emit('close')
		},
	},
})
</script>