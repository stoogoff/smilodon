<template>
	<li>
		<div @click="toggleOpen">
			<icon-view :icon="icon" />
			<span @click.stop="viewCategory">{{ category.title }}</span>
		</div>
		<slide-down>
			<category-tree
				:class="{ 'hidden': !open }"
				:parent="category._id"
				:open-all="openAll"
				:tree="tree" />
		</slide-down>
	</li>
</template>
<script>

import Vue from 'vue'

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
		openAll: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			open: this.openAll,
		}
	},

	computed: {
		icon() {
			return this.open ? 'folderOpen' : 'folder'
		},
	},

	watch: {
		openAll(newValue) {
			this.open = newValue
		},
	},

	methods: {
		toggleOpen() {
			this.open = !this.open
		},

		async viewCategory() {
			this.$nuxt.$router.push(this.category.slug)
		},
	},
})

</script>
