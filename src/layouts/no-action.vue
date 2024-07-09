<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<message-toast />
	</div>
</template>
<script>

import ThemeManager from '~/managers/theme'

export default {
	name: 'NoActionLayout',

	mounted() {
		ThemeManager.loadTheme()
	},
}

</script>