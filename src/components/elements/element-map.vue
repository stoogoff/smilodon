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
import Konva from 'konva'

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

	data() {
		return {
			stage: null,
			layers: {},
		}
	},

	mounted() {
		const WIDTH = 1000
		const HEIGHT = 500

		this.stage = new Konva.Stage({
			container: 'canvas',
			width: WIDTH,
			height: HEIGHT,
		})

		this.layers = {
			category: new Konva.Layer(),
			link: new Konva.Layer(),
			mention: new Konva.Layer(),
			property: new Konva.Layer(),
			tag: new Konva.Layer(),
			main: new Konva.Layer(),
		}

		Object.values(this.layers).forEach(layer => {
			this.stage.add(layer)
		})

		const node = new Konva.Text({
			x: this.stage.width() / 2,
			y: this.stage.height() / 2,
			fontSize: 16,
			text: this.element.title,
			width: 150,
			fill: 'black',
			align: 'center',
			verticalAlign: 'middle',
			padding: 10,
		})

		const rect = new Konva.Rect({
			x: node.x(),
			y: node.y(),
			width: node.width(),
			height: node.height(),
			fill: 'red',
			cornerRadius: 10,
		})

		this.layers.main.add(rect)
		this.layers.main.add(node)

		const RADIUS = 200
		const LEN = this.linked.length

		const getBackgroundColour = connection => {
			if(connection.hasMatchingProperty) return 'brown'
			if(connection.isMention) return 'blue'
			if(connection.isLink) return 'orange'
			if(connection.isTag) return 'purple'
			if(connection.isCategory) return 'green'

			return 'white'
		}

		const getLayer = connection => {
			if(connection.isCategory) return this.layers.category
			if(connection.isMention) return this.layers.mention
			if(connection.isLink) return this.layers.link
			if(connection.isTag) return this.layers.tag
			if(connection.hasMatchingProperty) return this.layers.property

			return this.layers.main
		}

		this.linked.forEach((connection, index) => {
			const linked = new Konva.Text({
				x: node.x() + RADIUS * Math.cos(2 * Math.PI * index / LEN),
				y: node.y() + RADIUS * Math.sin(2 * Math.PI * index / LEN),
				fontSize: 16,
				text: connection.title,
				width: 150,
				fill: 'black',
				align: 'center',
				verticalAlign: 'middle',
				padding: 10,
			})

			const linkedRect = new Konva.Rect({
				x: linked.x(),
				y: linked.y(),
				width: linked.width(),
				height: linked.height(),
				fill: getBackgroundColour(connection),
				cornerRadius: 10,
			})

			const line = new Konva.Line({
				points: [
					node.x() + node.width() / 2,
					node.y() + node.height() / 2,
					linked.x() + linked.width() / 2,
					linked.y() + linked.height() / 2,
				],
				stroke: '#ccc',
				strokeWidth: 2,
				lineCap: 'round',
				lineJoin: 'round'
			});

			const layer = getLayer(connection)

			layer.add(line)
			layer.add(linkedRect)
			layer.add(linked)
		})

		console.log(this.linked)
	},

	methods: {
		toggleLayer(name) {
			if(!(name in this.layers)) return

			const layer = this.layers[name]

			if(layer.isVisible()) {
				layer.hide()
			}
			else {
				layer.show()
			}
		}
	},
})

</script>