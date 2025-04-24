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

class Tree {
	constructor(title, style) {
		this.title = title
		this.style = style
		this.children = []
	}

	addChild(title, style) {
		const child = new Tree(title, style)

		this.children.push(child)

		return child
	}

	addChildren(children, style) {
		children.forEach(child => this.addChild(child, style))
	}
}

class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class Rectangle extends Point {
	constructor(x, y, width, height) {
		super(x, y)

		this.width = width
		this.height = height
	}

	get point() {
		return new Point(this.x, this.y)
	}
}


const createRoot = (layer, obj, position) => {
	const node = new Konva.Text({
		x: position.x,
		y: position.y,
		fontSize: 16,
		text: obj.title,
		width: 150,
		fill: '#333',
		align: 'center',
		verticalAlign: 'middle',
		padding: 10,
	})

	const rect = new Konva.Rect({
		x: node.x(),
		y: node.y(),
		width: node.width(),
		height: node.height(),
		fill: '#ddd',
		strokeWidth: 2,
		stroke: '#444',
		cornerRadius: 10,
	})

	layer.add(rect)
	layer.add(node)

	return rect
}

const createNode = (layer, obj, position, root) => {
	const linked = new Konva.Text({
		x: position.x,
		y: position.y,
		fontSize: 14,
		text: obj.title,
		width: 150,
		fill: '#333',
		align: 'center',
		verticalAlign: 'middle',
		padding: 8,
	})

/*	const image = new Konva.Image({
		width: 24,
		height: 24
	})*/

	const rect = new Konva.Rect({
		x: linked.x(),
		y: linked.y(),
		width: linked.width(),
		height: linked.height(),
		fill: 'white',
		strokeWidth: 2,
		stroke: '#555',
		cornerRadius: 10,
	})

	const line = new Konva.Line({
		points: [
			root.x + root.width / 2,
			root.y + root.height / 2,
			linked.x() + linked.width() / 2,
			linked.y() + linked.height() / 2,
		],
		stroke: '#ccc',
		strokeWidth: 2,
		lineCap: 'round',
		lineJoin: 'round'
	});

	layer.add(line)
	layer.add(rect)
	layer.add(linked)

	return rect
}

const createSection = (layer, obj, position, root) => {
	// TODO add icon
	const linked = new Konva.Text({
		x: position.x,
		y: position.y,
		fontSize: 14,
		text: obj.title,
		fill: '#555',
		align: 'center',
		verticalAlign: 'middle',
		padding: 10,
	})

	const rect = new Konva.Rect({
		x: linked.x(),
		y: linked.y(),
		width: linked.width(),
		height: linked.height(),
		fill: 'white',
	})

	const line = new Konva.Line({
		points: [
			root.x + root.width / 2,
			root.y + root.height / 2,
			linked.x() + linked.width() / 2,
			linked.y() + linked.height() / 2,
		],
		stroke: '#ccc',
		strokeWidth: 2,
		lineCap: 'round',
		lineJoin: 'round'
	});

	layer.add(line)
	layer.add(rect)
	layer.add(linked)

	return rect
}

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
			//layers: {},
		}
	},

	async mounted() {
		const WIDTH = 1000
		const HEIGHT = 500

		this.stage = new Konva.Stage({
			container: 'canvas',
			width: WIDTH,
			height: HEIGHT,
			draggable: true,
		})

		const mainLayer = new Konva.Layer()
		const sectionLayer = new Konva.Layer()
		const nodeLayer = new Konva.Layer()

		this.stage.add(nodeLayer)
		this.stage.add(sectionLayer)
		this.stage.add(mainLayer)

		const root = new Tree(this.element.title, 'root')

		// add the category if there are elements which share it
		if(this.linked.some(link => link.isCategory)) {
			const category = await this.$categories.byId(this.element.category)
			const categoryTree = root.addChild(category.title, 'section')

			categoryTree.addChildren(this.linked
				.filter(link => link.category === category._id)
				.map(({ title }) => title), 'node')
		}

		// add tags and related
		if(this.linked.some(link => link.isTag)) {
			const taggedLinks = this.linked.filter(link => link.isTag)

			this.element.tags.forEach(tag => {
				if(taggedLinks.some(link => link.tags.includes(tag))) {
					const tagTree = root.addChild(tag, 'section')

					tagTree.addChildren(taggedLinks
						.filter(link => link.tags.includes(tag))
						.map(({ title }) => title), 'node')
				}
			})
		}

		console.log({ root })

		const RADIUS = 200

		const recurseTree = (tree, point, centre) => {
			console.log({ title: tree.title, point })

			if(tree.style === 'node') {
				createNode(nodeLayer, tree, point, centre)
				return
			}

			const node = tree.style === 'root'
				? createRoot(mainLayer, tree, point)
				: createSection(sectionLayer, tree, point, centre)

			const newCentre = new Rectangle(
				node.x(),
				node.y(),
				node.width(),
				node.height())

			const len = tree.children.length + 1

			tree.children.forEach((leaf, index) => {
				const newPoint = new Point(
						point.x + RADIUS * Math.cos(2 * Math.PI * index / len),
						point.y + RADIUS * Math.sin(2 * Math.PI * index / len))


				recurseTree(leaf,
					newPoint,
					newCentre)
			})
		}

		recurseTree(root, new Point(this.stage.width() / 2 - 100, this.stage.height() / 2))
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