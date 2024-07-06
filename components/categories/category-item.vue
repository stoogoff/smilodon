<template>
	<li>
		<div @click="toggleOpen" :class="{ 'bg-base-300': isActive }">
			<icon-view :icon="icon" :class="{ 'text-primary': isActive }" />
			<span @click.stop="viewCategory" class="hover:link hover:link-primary">{{ category.title }}</span>
		</div>
		<category-tree
			:class="{ 'hidden': !isOpen }"
			:parent="category._id"
			:tree="tree" />
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
		isActive() {
			return this.$route.fullPath === this.category.slug
		},

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
