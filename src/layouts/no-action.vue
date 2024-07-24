<template>
	<div>
		<app-nav />
		<sidebar>
			<main class="main grid ml-10">
				<category-panel />
				<Nuxt />
			</main>
		</sidebar>
		<message-toast />
	</div>
</template>
<script>

import Theme from '~/modules/theme'

export default {
	name: 'NoActionLayout',

	mounted() {
		Theme.loadTheme()
	},
}

</script>