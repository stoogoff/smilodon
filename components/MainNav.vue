<template>
	<we-main-nav :menu-items="menuItems">Smilodon</we-main-nav>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'we-ui/utils/list'
import { MENU_ITEMS, PROJECTS_UPDATED } from '~/utils/config'
import { EventBus } from '~/utils/event-bus'

export default Vue.component('MainNav', {
	async fetch() {
		const projects = await this.$projects.all()

		if(projects.length > 0) {
			const menuItems = this.menuItems

			menuItems[1].menuItems = projects
				.sort(sortByProperty('title'))
				.map(({ title, slug }) => ({
					title,
					href: `/projects/${slug}`,
				}))

			this.menuItems = [ ...menuItems ]
		}
	},
	fetchOnServer: false,

	data() {
		return {
			menuItems: [ ...MENU_ITEMS ]
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
	},
})

</script>