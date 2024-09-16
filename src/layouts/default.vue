<template>
	<div>
		<app-nav />
		<sidebar>
			<main class="main grid ml-10">
				<category-panel />
				<Nuxt />
			</main>
		</sidebar>
		<element-overlay
			v-if="addElement"
			@save="saveElement"
			@cancel="closeElementEditor"
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

import Theme from '~/modules/theme'

export default {
	name: 'DefaultLayout',

	data() {
		return {
			addElement: false,
		}
	},

	mounted() {
		Theme.loadTheme()
	},

	methods: {
		closeElementEditor() {
			this.addElement = false
		},

		saveElement(element) {
			this.addElement = false

			if(element)
				this.$router.push(element.slug)
		},
	},
}

</script>