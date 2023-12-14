<template>
	<!-- we-main-nav :menu-items="menuItems">Smilodon</we-main-nav -->
	<div class="navbar bg-base-100">
		<div class="flex-1">
			<a class="btn btn-ghost text-xl">Smilodon</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li v-for="(item, idx) in menuItems" :key="`menu_${ idx }`">
					<details v-if="item.menuItems">
						<summary>{{ item.title }}</summary>
						<ul class="p-2 bg-base-100 rounded-t-none">
							<li v-for="(subitem, jdx) in item.menuItems">
								<nuxt-link :to="subitem.href">{{ subitem.title }}</nuxt-link>
							</li>
						</ul>
					</details>
					<nuxt-link v-else :to="item.href">{{ item.title }}</nuxt-link>
				</li>
			</ul>
		</div>
	</div>
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
					href: slug,
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