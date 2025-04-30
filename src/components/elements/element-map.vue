<template>
	<div id="canvas"></div>
</template>
<script>

import Vue from 'vue'
import { DataSet } from 'vis-data/peer'
import { Network } from 'vis-network/peer'
import { root, element, section, link } from '~/utils/network'

export default Vue.component('ElementMap', {
	props: {
		element: {
			type: Object,
			required: true,
		},
		linked: {
			type: Array,
			required: true,
		},
		redraw: {
			type: Number,
			default: 0,
		}
	},

	async fetch() {
		// create an array with nodes
		const nodes = [
			root(this.element._id, this.element.title),
			...this.linked.map(item => element(item._id, item.title))
		]

		// create an array with edges
		let edges = []

		// add the category if there are elements which share it
		if(this.linked.some(item => item.isCategory)) {
			const category = await this.$categories.byId(this.element.category)

			nodes.push(section(category._id, category.title, 'folder'))

			edges = [...edges, link(category._id, this.element._id), ...this.linked
				.filter(item => item.category === category._id)
				.map(item => link(item._id, category._id))
			]
		}

		// add tags and related
		if(this.linked.some(item => item.isTag)) {
			const taggedLinks = this.linked.filter(item => item.isTag)

			this.element.tags.forEach(tag => {
				if(taggedLinks.some(item => item.tags.includes(tag))) {
					nodes.push(section(tag, tag, 'tag'))

					edges = [...edges, link(tag, this.element._id), ...taggedLinks
						.filter(item => item.tags.includes(tag))
						.map(item => link(item._id, tag))
					]
				}
			})
		}

		// mentions
		if(this.linked.some(item => item.isMention)) {
			nodes.push(section('mentions', 'Mentions', 'chat'))

			edges = [...edges, link('mentions', this.element._id), ...this.linked
				.filter(item => item.isMention)
				.map(item => link(item._id, 'mentions'))]
		}

		// links
		if(this.linked.some(item => item.isLink)) {
			nodes.push(section('links', 'Links', 'link'))

			edges = [...edges, link('links', this.element._id), ...this.linked
				.filter(item => item.isLink)
				.map(item => link(item._id, 'links'))]
		}

		// properties
		if(this.linked.some(item => item.hasMatchingProperty)) {
			const propertyLinks = this.linked
				.filter(item => item.hasMatchingProperty)
				.flatMap(item => item.matchingProperties.map(property => ({
					id: item._id,
					key: `${property.name}: ${property.value}`,
				})))
				.reduce((acc, current) => {
					acc[current.key] = acc[current.key] ?? []
					acc[current.key].push(current.id)

					return acc
				}, {})

			Object.keys(propertyLinks).forEach(property => {
				nodes.push(section(property, property, 'property'))

				edges = [...edges, link(property, this.element._id), ...propertyLinks[property]
					.map(item => link(item, property))]
			})
		}

		// create a network
		const data = {
			nodes: new DataSet(nodes),
			edges: new DataSet(edges),
		}

		this.container = document.getElementById('canvas')
		this.network = new Network(this.container, data, {
			height: '500px',
			edges: {
				color: '#ccc',
			},
		})
	},
	fetchOnServer: false,

	data() {
		return {
			container: null,
			network: null,
		}
	},

	beforeDestroy() {
		if(this.network) {
			this.network.destroy()
		}
	},

	watch: {
		redraw() {
			if(this.network) {
				this.network.focus(this.element._id)
			}
			else {
				this.$fetch()
			}
		},
	},
})

</script>