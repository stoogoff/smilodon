<template>
	<aside class="p-4">
		<div class="flex">
			<h3 class="mx-4 mt-1 flex-1">Project</h3>
			<div class="flex-none">
				<d-button
					sm
					ghost
					class="tooltip tooltip-bottom"
					data-tip="Create Category"
					@click="showForm"><icon-view icon="folderPlus" /></d-button>
				<d-button
					sm
					ghost
					class="tooltip tooltip-bottom"
					:data-tip="(isOpenAll ? 'Close' : 'Open') + ' Categories'"
					@click="toggleOpenAll"><icon-view :icon="isOpenAll ? 'collapseAll' : 'expandAll'" /></d-button>
			</div>
		</div>
		<category-tree :project="project" :tree="treeData" />
		<div v-if="showAddForm">
			<d-divider></d-divider>
			<category-editor @save="hideForm" @cancel="hideForm" :parent="currentCategory" sm />
		</div>
	</aside>
</template>
<script>

import Vue from 'vue'
import { isIn } from 'vue-daisy-ui/utils/assert'
import { required, validate } from 'vue-daisy-ui/utils/validators'
import Tree from '~/modules/tree'
import { EventBus } from '~/utils/event-bus'
import {
	PROJECTS_UPDATED,
	CATEGORIES_UPDATED,
	ELEMENTS_UPDATED
} from '~/utils/config'

export default Vue.component('CategoryPanel', {
	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
		this.treeData = await Tree.load(this.project._id)
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
			treeData: {},
			showAddForm: false,
			currentCategory: null,
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
		EventBus.$on(CATEGORIES_UPDATED, () => this.$fetch())
		EventBus.$on(ELEMENTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
		EventBus.$off(CATEGORIES_UPDATED)
		EventBus.$off(ELEMENTS_UPDATED)
	},

	watch: {
		$route(to, from) {
			this.$fetch()
		},
	},

	computed: {
		isOpenAll() {
			return this.project ? Tree.isProjectOpen(this.project._id) : false
		},
	},

	methods: {
		async showForm() {
			if(isIn('categoryId', this.$route.params)) {
				this.currentCategory = await this.$categories.byId(this.$route.params.categoryId)
			}
			else if(isIn('elementId', this.$route.params)) {
				const element = await this.$elements.byId(this.$route.params.elementId)

				if(element) {
					this.currentCategory = await this.$categories.byId(element.category)
				}
			}

			this.showAddForm = true
		},

		hideForm() {
			this.showAddForm = false
			this.currentCategory = null
		},

		async toggleOpenAll() {
			await Tree.toggleAll(this.project._id)
		},
	},
})

</script>
