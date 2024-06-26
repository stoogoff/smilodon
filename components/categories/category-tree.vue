<template>
	<ul class="menu menu-xs">
		<li v-if="project">
			<nuxt-link :to="project.slug">
				<icon-view icon="home" />
				{{ project.title }}
			</nuxt-link>
		</li>
		<category-item
			v-for="category in categories"
			:key="category._id"
			:category="category"
			:tree="tree"
		/>
		<entity-item
			v-for="entity in entities"
			:key="entity._id"
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

	methods: {
		prepareTree() {
			const content = this.tree[this.parent] || []

			this.categories = content.filter(item => item._id.startsWith(CATEGORY_ID_PREFIX))
			this.entities = content.filter(item => item._id.startsWith(ENTITY_ID_PREFIX))
		},
	},
})

</script>
