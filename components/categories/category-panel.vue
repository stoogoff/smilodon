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
					:data-tip="(openAll ? 'Close' : 'Open') + ' Categories'"
					@click="toggleOpenAll"><icon-view :icon="openAll ? 'collapseAll' : 'expandAll'" /></d-button>
			</div>
		</div>
		<category-tree :open-all="openAll" :project="project" :tree="treeData" />
		<div v-if="showAddForm">
			<d-divider></d-divider>
			<category-editor @save="hideForm" @cancel="hideForm" :parent="currentCategory" sm />
		</div>
	</aside>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'vue-daisy-ui/utils/validators'
import { home } from '~/utils/icons'
import { EventBus } from '~/utils/event-bus'
import {
	PROJECTS_UPDATED,
	CATEGORIES_UPDATED,
	ENTITIES_UPDATED
} from '~/utils/config'

export default Vue.component('CategoryPanel', {
	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)

		const entities = await this.$entities.allByProject(params.projectId)
		const categories = await this.$categories.allByProject(params.projectId)

		const byParent = {}
		const combine = property => {
			return item => {
				if(!(item[property] in byParent)) {
					byParent[item[property]] = []
				}

				byParent[item[property]].push(item)
			}
		}

		entities.forEach(combine('category'))
		categories.forEach(combine('parent'))

		this.treeData = byParent
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
			treeData: {},
			showAddForm: false,
			openAll: false,
			currentCategory: null,
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
		EventBus.$on(CATEGORIES_UPDATED, () => this.$fetch())
		EventBus.$on(ENTITIES_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
		EventBus.$off(CATEGORIES_UPDATED)
		EventBus.$off(ENTITIES_UPDATED)
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
		async showForm() {
			if('categoryId' in this.$route.params) {
				this.currentCategory = await this.$categories.byId(this.$route.params.categoryId)
			}
			else if('entityId' in this.$route.params) {
				const entity = await this.$entities.byId(this.$route.params.entityId)

				if(entity) {
					this.currentCategory = await this.$categories.byId(entity.category)
				}
			}

			this.showAddForm = true
		},

		hideForm() {
			this.showAddForm = false
			this.currentCategory = null
		},

		toggleOpenAll() {
			this.openAll = !this.openAll
		},
	},
})

</script>
