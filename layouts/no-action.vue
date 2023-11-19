<template>
	<div>
		<we-main-nav :menu-items="menuItems">Smilodon</we-main-nav>
		<main class="main pt-16 px-2 pb-2 grid">
			<category-panel />
			<Nuxt />
		</main>
	</div>
</template>
<script>

import { MENU_ITEMS } from '~/utils/config'

export default {
	name: 'NoActionLayout',

	computed: {
		menuItems() {
			return MENU_ITEMS
		},
	},
}

</script>