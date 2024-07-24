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

import Theme from '~/modules/theme'

export default {
	name: 'NoProjectLayout',

	mounted() {
		Theme.loadTheme()
	},
}

</script>