<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<element-overlay
			v-if="addElement"
			@close="saveElement"
		/>
		<d-button
			class="fixed right-4 bottom-4"
			primary
			circle
			@click="addElement = true"
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
			addElement: false,
		}
	},

	mounted() {
		ThemeManager.loadTheme()
	},

	methods: {
		saveElement(element) {
			this.addElement = false

			if(element)
				this.$router.push(element.slug)
		},
	},
}

</script>