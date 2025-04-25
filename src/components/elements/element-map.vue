<template>
	<div>
		<d-join>
			<d-button sm class="join-item" @click="toggleLayer('category')">category</d-button>
			<d-button sm class="join-item" @click="toggleLayer('link')">link</d-button>
			<d-button sm class="join-item" @click="toggleLayer('mention')">mention</d-button>
			<d-button sm class="join-item" @click="toggleLayer('property')">property</d-button>
			<d-button sm class="join-item" @click="toggleLayer('tag')">tag</d-button>
		</d-join>
		<div id="canvas"></div>
	</div>
</template>
<script>

import Vue from 'vue'
import { DataSet } from 'vis-data/peer'
import { Network } from 'vis-network/peer'
import { getIcon } from '~/utils/icons'


const section = (id, label, icon) => ({
	id,
	label,
	image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(getIcon(icon)),
	shape: 'image',
	size: 12,
	color: 'white',
	font: { size: 14, color: '#555' },
})

const link = (from, to) => ({
	from,
	to,
})

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
	},

	async mounted() {
		const WIDTH = 1000
		const HEIGHT = 500

		// create an array with nodes
		const nodes = [
			{
				id: this.element._id,
				label: this.element.title,
				shape: 'box',
				color: { background: '#bbb', border: 'black' },
				margin: 8,
				font: { size: 16, color: '#222' },
				x: 250,
				y: 250,
			},
			...this.linked.map(link => ({
				id: link._id,
				label: link.title,
				shape: 'box',
				color: { background: '#ddd', border: '#bbb' },
				margin: 6,
				font: { size: 14, color: '#333' },
			}))
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

			edges = [...edges, { from: 'mentions', to: this.element._id }, ...this.linked
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

		console.log(this.linked)
		console.log({ nodes, edges })

		// create a network
		const data = {
			nodes: new DataSet(nodes),
			edges: new DataSet(edges),
		}

		const container = document.getElementById('canvas')
		const network = new Network(container, data, {
			height: '500px',
			edges: {
				color: '#ccc',
			},
		})

		//network.focus(this.element._id)
	},

	methods: {
		toggleLayer(name) {
			/*if(!(name in this.layers)) return

			const layer = this.layers[name]

			if(layer.isVisible()) {
				layer.hide()
			}
			else {
				layer.show()
			}*/
		}
	},
})

</script>