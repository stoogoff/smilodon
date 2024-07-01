<template>
	<div class="navbar bg-base-100 shadow px-4 py-0">
		<div class="flex-1">
			<nuxt-link to="/" class="btn btn-ghost text-xl btn-sm">Smilodon</nuxt-link>
		</div>
		<div class="flex-none">
			<nuxt-link to="/projects" tabindex="0" role="button" class="btn btn-ghost btn-sm">
				Dashboard
			</nuxt-link>
			<nuxt-link to="/changes" tabindex="0" role="button" class="btn btn-ghost btn-sm">
				Changes
			</nuxt-link>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-sm">
					Projects
				</div>
				<ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
					<li v-for="(item, idx) in menuItems" :key="`menu_${ idx }`">
						<nuxt-link :to="item.href">{{ item.title }}</nuxt-link>
						<ul v-if="item.menuItems">
							<li v-for="(subitem, jdx) in item.menuItems">
								<nuxt-link :to="subitem.href">{{ subitem.title }}</nuxt-link>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { PROJECTS_UPDATED } from '~/utils/config'
import { EventBus } from '~/utils/event-bus'

export default Vue.component('MainNav', {
	async fetch() {
		const projects = await this.$projects.all()

		if(projects.length > 0) {
			this.menuItems = projects
				.sort(sortByProperty('title'))
				.map(({ title, slug }) => ({
					title,
					href: slug,
				}))
		}
	},
	fetchOnServer: false,

	data() {
		return {
			menuItems: []
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