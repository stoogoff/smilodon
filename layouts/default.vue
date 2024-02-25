<template>
	<div>
		<main-nav />
		<main class="main pt-16 px-2 pb-2 grid">
			<category-panel />
			<Nuxt />
		</main>
		<entity-overlay
			v-if="showPublish"
			@close="showPublish = false"
		/>
		<d-button
			class="fixed right-4 bottom-4"
			primary
			circle
			@click="showPublish = true"
		>
			<d-icon :icon="plusIcon" />
		</d-button>
	</div>
</template>
<script>

import { plus } from '~/utils/icons'

export default {
	name: 'DefaultLayout',

	data() {
		return {
			showPublish: false,
		}
	},

	computed: {
		plusIcon() {
			return plus
		},
	},
}

</script>