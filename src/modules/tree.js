
import Vue from 'vue'
import uniq from 'lodash/uniq'
import { notIn, throwIfNull } from 'vue-daisy-ui/utils/assert'
import { local } from 'vue-daisy-ui/utils/storage'
import { element } from '~/state/element'
import { category } from '~/state/category'
import { TREE_STATE, TREE_STATE_PROJECT } from '~/utils/config'

const state = Vue.observable({
	tree: {},
	open: [],
	project: [],
})

// update the current tree state in local storage
const updateStorage = () => {
	local.set(TREE_STATE, state.open)
	local.set(TREE_STATE_PROJECT, state.project)
}

export default {
	// load all category and element data for the project
	// and return it as an object with the id as key
	// and any child entities or categories as an array of values
	async loadForProject(projectId) {
		throwIfNull(projectId, 'projectId')

		const entities = await element().allByProject(projectId)
		const categories = await category().allByProject(projectId)

		const byParent = {}
		const combine = property => {
			return item => {
				if(notIn(item[property], byParent)) {
					byParent[item[property]] = []
				}

				byParent[item[property]].push(item)
			}
		}

		entities.forEach(combine('category'))
		categories.forEach(combine('parent'))

		return byParent
	},

	// load tree data and store in state
	// read open folder state from local storage
	async load(projectId) {
		const byParent = await this.loadForProject(projectId)

		state.tree[projectId] = byParent

		if(local.has(TREE_STATE)) {
			state.open = local.get(TREE_STATE)
		}

		if(local.has(TREE_STATE_PROJECT)) {
			state.project = local.get(TREE_STATE_PROJECT)
		}

		return byParent
	},

	// open or close all categories for the project
	async toggleAll(projectId) {
		if(this.isProjectOpen(projectId)) {
			await this.closeAll(projectId)
		}
		else {
			await this.openAll(projectId)
		}
	},

	// open all categories for the project
	async openAll(projectId) {
		if(notIn(projectId, state.tree))
			await this.load(projectId)

		const tree = state.tree[projectId]

		state.open = uniq([ ...Object.keys(tree), ...state.open ])
		state.project = uniq([ projectId, ...state.project ])

		updateStorage()
	},

	// close all categories for the project
	async closeAll(projectId) {
		if(notIn(projectId, state.tree))
			await this.load(projectId)

		const tree = state.tree[projectId]
		const ids = Object.keys(tree)

		state.open = state.open.filter(item => !ids.includes(item))
		state.project = state.project.filter(item => item !== projectId)

		updateStorage()
	},

	// return true if all categories for the project are open
	isProjectOpen(projectId) {
		return state.project.includes(projectId)
	},

	// toggle open the supplied category
	toggleOpen(categoryId) {
		if(this.isOpen(categoryId)) {
			state.open = state.open.filter(item => item !== categoryId)
		}
		else {
			state.open = [ categoryId, ...state.open ]
		}

		updateStorage()
	},

	// return true if the supplied category is open
	isOpen(categoryId) {
		return state.open.includes(categoryId)
	},
}
