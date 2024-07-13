<template>
	<d-drawer class="pt-10" @open="sidebarOpen" @close="sidebarClose">
		<slot />
		<template #menu>
			<ul class="menu bg-neutral text-neutral-content w-80 py-4 min-h-full border-r border-base-content pt-10">
				<li class="border-b">
					<label for="drawer" aria-label="close sidebar" class="flex pr-0">
						<span class="flex-1">Collapse</span>
						<d-tooltip :title="collapseOrExpand" right>
							<icon-view class="flex-initial flex-end" :icon="sidebarIcon" lg />
						</d-tooltip>
					</label>
				</li>
				<li class="border-b">
					<nuxt-link to="/projects" class="flex pr-0">
						<span class="flex-1">Dashboard</span>
						<d-tooltip title="Dashboard" right>
							<icon-view class="flex-initial flex-end" icon="dashboard" lg />
						</d-tooltip>
					</nuxt-link>
				</li>
				<li v-for="project in projects" :key="project._id">
					<nuxt-link :to="project.slug" class="flex pr-0">
						<span class="flex-1">{{ project.title }}</span>
						<d-tooltip :title="project.title" right>
							<icon-view class="flex-initial flex-end" icon="dashboard" lg />
						</d-tooltip>
					</nuxt-link>
				</li>
				<li>
					<nuxt-link to="/changes">
						Changes
					</nuxt-link>
				</li>
			</ul>
		</template>
	</d-drawer>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { PROJECTS_UPDATED } from '~/utils/config'
import { EventBus } from '~/utils/event-bus'

export default Vue.component('Sidebar', {
	async fetch() {
		this.projects = await this.$projects.all()
	},
	fetchOnServer: false,

	data() {
		return {
			projects: [],
			sidebarIcon: 'chevronRight',
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
	},

	computed: {
		collapseOrExpand() {
			return this.sidebarIcon === 'chevronRight' ? 'Expand' : 'Collapse'
		},
	},

	methods: {
		sidebarOpen() {
			this.sidebarIcon = 'chevronLeft'
		},

		sidebarClose() {
			this.sidebarIcon = 'chevronRight'
		},
	},
})

</script>
<style>

.drawer-side > *:not(.drawer-overlay) {
	@apply pointer-events-auto;
	transform: translateX(-86%);

	[dir="rtl"] & {
		transform: translateX(86%);
	}
}

</style>
