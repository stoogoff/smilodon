<template>
	<li class="py-1">
		<div class="flex cursor-pointer" @click="toggleOpen">
			<we-icon-view class="inline-block w-5 text-gray-600 mr-1" :icon="icon" />
			<span class="flex-grow link" @click="viewCategory">{{ category.title }}</span>
		</div>
		<slide-down>
			<ul class="ml-6" v-if="open">
				<category-tree :parent="category._id" />
			</ul>
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

		viewCategory() {
			this.$nuxt.$router.push(`/categories/${ this.category.slug }`)
		},
	},
})

</script>
