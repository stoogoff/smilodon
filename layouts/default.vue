<template>
	<div>
		<we-main-nav :menu-items="menuItems">Smilodon</we-main-nav>
		<main class="main pt-16 px-2 pb-2 grid">
			<category-panel />
			<Nuxt />
		</main>
		<entity-overlay
			v-if="showPublish"
			@close="showPublish = false"
		/>
		<we-icon-action
			type="primary"
			:icon="plusIcon"
			class="fixed right-4 bottom-4 circle-icon"
			@click="showPublish = true"
		/>
	</div>
</template>
<script>

import { plus } from '~/utils/icons'
import { MENU_ITEMS } from '~/utils/config'

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

		menuItems() {
			return MENU_ITEMS
		},
	},
}

</script>