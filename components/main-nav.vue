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
			<popup-button y="top" x="right">
				{{ selectedTheme }}
				<template #popup>
					<ul>
						<li v-for="theme in themes" :key="theme" @click="chooseTheme(theme)">
							<span class="link">{{ theme }}</span>
						</li>
					</ul>
				</template>
			</popup-button>
			<popup-button y="top" x="right">
				Projects
				<template #popup>
					<ul tabindex="0">
						<li v-for="(item, idx) in menuItems" :key="`menu_${ idx }`">
							<nuxt-link :to="item.href">{{ item.title }}</nuxt-link>
							<ul v-if="item.menuItems">
								<li v-for="(subitem, jdx) in item.menuItems">
									<nuxt-link :to="subitem.href">{{ subitem.title }}</nuxt-link>
								</li>
							</ul>
						</li>
					</ul>
				</template>
			</popup-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { toTitleCase } from 'vue-daisy-ui/utils/string'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { PROJECTS_UPDATED } from '~/utils/config'
import { EventBus } from '~/utils/event-bus'
import { local } from '~/utils/storage'

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
			menuItems: [],
			selectedTheme: local.has('theme') ? local.get('theme') : 'Light',
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())

		document.documentElement.setAttribute('data-theme', this.selectedTheme.toLowerCase())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
	},

	computed: {
		themes() {
			return [
				'light',
				'dark',
				'cupcake',
				'bumblebee',
				'emerald',
				'corporate',
				'synthwave',
				'retro',
				'cyberpunk',
				'valentine',
				'halloween',
				'garden',
				'forest',
				'aqua',
				'lofi',
				'pastel',
				'fantasy',
				'wireframe',
				'black',
				'luxury',
				'dracula',
				'cmyk',
				'autumn',
				'business',
				'acid',
				'lemonade',
				'night',
				'coffee',
				'winter',
				'dim',
				'nord',
				'sunset',
			].map(s => toTitleCase(s)).sort()
		}
	},

	methods: {
		chooseTheme(theme) {
			this.selectedTheme = theme
			local.set('theme', theme)
			document.documentElement.setAttribute('data-theme', theme.toLowerCase())
		}
	},
})

</script>