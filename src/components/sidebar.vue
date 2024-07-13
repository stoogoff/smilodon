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
				<sidebar-item to="/projects" title="Dashboard" icon="dashboard" class="border-b" />
				<sidebar-item v-for="project in projects"
					:key="project._id"
					:to="project.slug"
					:title="project.title"
					icon="home"
				/>
				<sidebar-item to="/projects/create" title="Create Project" icon="plus" class="border-t" />
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
