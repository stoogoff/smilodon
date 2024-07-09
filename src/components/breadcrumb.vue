<template>
	<d-breadcrumbs class="text-xs" :items="breadcrumb" />	
</template>
<script>

import Vue from 'vue'
import { isNull, notNull, notEmptyString } from '~/utils/assert'
import icons, { getIcon } from '~/utils/icons'

export default Vue.component('Breadcrumb', {
	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)

		if(notNull(params.elementId)) {
			this.element = await this.$elements.byId(params.elementId)
		}

		if(notNull(params.categoryId)) {
			this.ancestors = await this.$categories.ancestors(params.categoryId)
		}
		else if(notNull(this.element) && notEmptyString(this.element.category)) {
			this.ancestors = await this.$categories.ancestors(this.element.category)
		}
	},
	fetchOnServer: false,

	data() {
		return {
			element: null,
			project: null,
			ancestors: [],
		}
	},

	computed: {
		breadcrumb() {
			if(isNull(this.project)) return []

			const output = [
				{
					title: this.project.title,
					url: this.project.slug,
					icon: icons.home,
				},
				...this.ancestors.map(item => ({
					title: item.title,
					url: item.slug,
					icon: icons.folder,
				})),
			]

			if(notNull(this.element)) {
				output.push({
					title: this.element.title,
					url: this.element.slug,
					icon: getIcon(this.element.icon),
				})
			}

			return output
		},
	},
})

</script>