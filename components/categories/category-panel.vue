<template>
	<aside class="p-4">
		<h3 class="uppercase bold text-sm text-st-black-light mx-4">Project</h3>
		<category-tree />
		<d-divider></d-divider>
		<category-editor v-if="showAddForm" @save="hideForm" @cancel="hideForm" />
		<d-button v-else primary sm outline block class="bg-st-grey-pale" @click="showForm">Create Category</d-button>
	</aside>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'vue-daisy-ui/utils/validators'
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
