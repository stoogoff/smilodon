<template>
	<ul class="menu menu-xs">
		<li v-if="project" :class="{ 'bg-base-300': isActive }">
			<nuxt-link :to="project.slug">
				<icon-view icon="home" :class="{ 'text-primary': isActive }" />
				<span class="hover:link hover:link-primary">{{ project.title }}</span>
			</nuxt-link>
		</li>
		<category-item
			v-for="category in categories"
			:key="`category_tree_${ category._id }`"
			:category="category"
			:tree="tree"
		/>
		<entity-item
			v-for="entity in entities"
			:key="`category_tree_${ entity._id }`"
			:entity="entity"
		/>
	</ul>	
</template>
<script>

import Vue from 'vue'
import TreeManager from '~/managers/tree'
import { ENTITY_ID_PREFIX, CATEGORY_ID_PREFIX } from '~/utils/config'
import { isEmptyString } from '~/utils/assert'

export default Vue.component('CategoryTree', {
	props: {
		project: {
			type: Object,
			default: null,
		},
		tree: {
			type: Object,
			default: {},
		},
		parent: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			categories: [],
			entities: [],
		}
	},

	mounted() {
		this.prepareTree()
	},

	watch: {
		tree(newValue) {
			this.prepareTree()
		},
	},

	computed: {
		isActive() {
			return this.$route.fullPath === this.project.slug
		},
	},

	methods: {
		prepareTree() {
			const content = this.tree[this.parent] || []

			this.categories = content.filter(item => item._id.startsWith(CATEGORY_ID_PREFIX))
			this.entities = content.filter(item => item._id.startsWith(ENTITY_ID_PREFIX))
		},
	},
})

</script>
