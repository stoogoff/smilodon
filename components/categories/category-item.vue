<template>
	<li>
		<div @click="toggleOpen">
			<icon-view :icon="icon" />
			<span @click.stop="viewCategory">{{ category.title }}</span>
		</div>
		<slide-down>
			<category-tree v-if="open" :parent="category._id" />
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
	},

	data() {
		return {
			open: false,
		}
	},

	computed: {
		icon() {
			return this.open ? 'folderOpen' : 'folder'
		},
	},

	methods: {
		toggleOpen() {
			this.open = !this.open
		},

		async viewCategory() {
			const project = await this.$projects.byId(this.category.project)

			this.$nuxt.$router.push(this.category.slug)
		},
	},
})

</script>
