<template>
	<li class="py-1">
		<div class="flex cursor-pointer hover:bg-gray-100" @click="toggleOpen">
			<d-icon class="text-gray-600 mr-1" :icon="icon" />
			<span class="flex-grow" @click.stop="viewCategory">{{ category.title }}</span>
		</div>
		<slide-down>
			<category-tree class="ml-6" v-if="open" :parent="category._id" />
		</slide-down>
	</li>
</template>
<script>

import Vue from 'vue'
import { folder, folderOpen } from '~/utils/icons'

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
			return this.open ? folderOpen : folder
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
