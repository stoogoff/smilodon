<template>
	<d-breadcrumbs class="text-xs" :items="breadcrumb" />	
</template>
<script>

import Vue from 'vue'
import { isNull, notNull, notEmptyString } from '~/utils/assert'
import { getIcon, folder, home } from '~/utils/icons'

export default Vue.component('Breadcrumb', {
	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)

		if(notNull(params.entityId)) {
			this.entity = await this.$entities.byId(params.entityId)
		}

		if(notNull(params.categoryId)) {
			this.ancestors = await this.$categories.ancestors(params.categoryId)
		}
		else if(notNull(this.entity) && notEmptyString(this.entity.category)) {
			this.ancestors = await this.$categories.ancestors(this.entity.category)
		}
	},
	fetchOnServer: false,

	data() {
		return {
			entity: null,
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
					icon: home,
				},
				...this.ancestors.map(item => ({
					title: item.title,
					url: item.slug,
					icon: folder,
				})),
			]

			if(notNull(this.entity)) {
				output.push({
					title: this.entity.title,
					url: this.entity.slug,
					icon: getIcon(this.entity.icon),
				})
			}

			return output
		},
	},
})

</script>