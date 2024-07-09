<template>
	<mindmap v-if="!$fetchState.pending" :nodes="nodes" :connections="connections" :editable="true" />
</template>
<script>

import Vue from 'vue'
import { notIn } from '~/utils/assert'

export default Vue.component('ElementMap', {
	props: {
		category: {
			type: Object,
			required: true,
		},
	},

	async fetch() {
		// TODO get all categories that belong to this category
		// TODO recurse?
		// TODO generate links from everything to this category
		// TODO generate links between entities based on tags
		console.log(this.category)
		// get all entities that belong to this category and convert to nodes
		const entities = await this.$elements.allByCategory(this.category._id)

		const RADIUS = 200
		const LEN = entities.length

		const nodes = [
			{
				text: this.category.title,
				fx: 0,
				fy: 0,
				category: 'category',
			},
			...entities.map(({ title, slug }, index) => ({
				text: title,
				fx: RADIUS * Math.cos(2 * Math.PI * index / LEN),
				fy: RADIUS * Math.sin(2 * Math.PI * index / LEN),
				category: 'element',
			}))
		]

		this.nodes = nodes
		console.log(this.nodes)

		// add links from all entities to the category node
		const connections = entities.map(({ title }) => ({
			source: title,
			target: this.category.title,
			curve: { x: 0, y: 0 },
		}))

		// add links between nodes based on tags
		const tags = {}

		entities.forEach(element => {
			if(element.tags && element.tags.length) {
				element.tags.forEach(tag => {
					if(notIn(tag, tags)) {
						tags[tag] = []
					}

					tags[tag].push(element.title)
				})
			}
		})

		this.connections = connections
	},
	fetchOnServer: false,

	data() {
		return {
			nodes: [],
			connections: [],
		}
	},
})

</script>