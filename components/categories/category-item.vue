<template>
	<li>
		<div @click="toggleOpen">
			<icon-view :icon="icon" />
			<span @click.stop="viewCategory" class="hover:link hover:link-primary">{{ category.title }}</span>
		</div>
		<slide-down>
			<category-tree
				:class="{ 'hidden': !isOpen }"
				:parent="category._id"
				:tree="tree" />
		</slide-down>
	</li>
</template>
<script>

import Vue from 'vue'
import TreeManager from '~/managers/tree'

export default Vue.component('CategoryItem', {
	props: {
		category: {
			type: Object,
			required: true,
		},
		tree: {
			type: Object,
			default: {},
		},
	},

	computed: {
		icon() {
			return this.isOpen ? 'folderOpen' : 'folder'
		},

		isOpen() {
			return TreeManager.isOpen(this.category._id)
		},
	},

	methods: {
		toggleOpen() {
			TreeManager.toggleOpen(this.category._id)
		},

		async viewCategory() {
			this.$nuxt.$router.push(this.category.slug)
		},
	},
})

</script>
