<template>
	<div>
		<app-nav />
		<sidebar>
			<main class="main ml-24 mr-10">
				<Nuxt />
			</main>
		</sidebar>
		<message-toast />
	</div>
</template>
<script>

import ThemeManager from '~/managers/theme'

export default {
	name: 'NoProjectLayout',

	mounted() {
		ThemeManager.loadTheme()
	},
}

</script>