<template>
	<aside>
		<div v-if="project !== null">
			<nuxt-link :to="project.slug">
				<we-icon-view class="inline-block w-5" :icon="home" />
				{{ project.title }}
			</nuxt-link>
		</div>
		<h3 class="uppercase text-sm text-gray-400">Categories</h3>
		<category-tree />
		<category-editor v-if="showAddForm" @save="hideForm" @cancel="hideForm" />
		<we-button-action v-else block @click="showForm">Add</we-button-action>
	</aside>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'we-ui/utils/validators'
import { home } from '~/utils/icons'
import { EventBus } from '~/utils/event-bus'
import { PROJECTS_UPDATED } from '~/utils/config'

export default Vue.component('CategoryPanel', {
	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
			showAddForm: false,
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
	},

	watch: {
		$route(to, from) {
			this.$fetch()
		},
	},

	computed: {
		home() {
			return home
		},
	},

	methods: {
		showForm() {
			this.showAddForm = true
		},

		hideForm() {
			this.showAddForm = false
		},
	},
})

</script>
