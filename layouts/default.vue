<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<entity-overlay
			v-if="addEntity"
			@close="saveEntity"
		/>
		<d-button
			class="fixed right-4 bottom-4"
			primary
			circle
			@click="addEntity = true"
		>
			<icon-view icon="plus" />
		</d-button>
		<message-toast />
	</div>
</template>
<script>

import ThemeManager from '~/managers/theme'

export default {
	name: 'DefaultLayout',

	data() {
		return {
			addEntity: false,
		}
	},

	mounted() {
		ThemeManager.loadTheme()
	},

	methods: {
		saveEntity(entity) {
			this.addEntity = false

			if(entity)
				this.$router.push(entity.slug)
		},
	},
}

</script>