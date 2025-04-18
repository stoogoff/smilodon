<template>
	<p class="italic">Coming soon...</p>
	<!-- canvas-view style="width: 100%; height: 600px">
		<c-line
			v-for="(obj, idx) in lines"
			:key="`line_${idx}`"
			:x1="obj.x1"
			:y1="obj.y1"
			:x2="obj.x2"
			:y2="obj.y2"
		/>
		<c-rectangle
			v-for="(obj, idx) in rectangles"
			:key="`rect_${obj.id}`"
			:x="obj.x"
			:y="obj.y"
			:width="obj.width"
			:height="obj.height"
			:colour="obj.colour"
			:text="obj.text"
		/>
	</canvas-view -->
</template>
<script>

import Vue from 'vue'

export default Vue.component('NetworkView', {
	/*props: {
		element: {
			type: Object,
			required: true,
		},
	},

	async fetch() {
		const linked = await this.$elements.connections(this.element)
		const RADIUS = 200
		const BASE = 300
		const LEN = linked.length

		const rectangles = linked.map((link, index) => ({
			id: link._id,
			x: BASE + RADIUS * Math.cos(2 * Math.PI * index / LEN),
			y: BASE + RADIUS * Math.sin(2 * Math.PI * index / LEN),
			width: 100,
			height: 50,
			colour: 'green',
			text: link.title,
		}))

		this.lines = rectangles.map(rect => ({
			x1: rect.x + rect.width / 2,
			y1: rect.y + rect.height / 2,
			x2: BASE + 50,
			y2: BASE + 25,
			colour: 'black',
		}))

		this.rectangles = [{
				id: this.element._id,
				x: BASE,
				y: BASE,
				width: 100,
				height: 50,
				colour: 'red',
				text: this.element.title,
			}, ...rectangles
		]
	},
	fetchOnServer: false,*/

	data() {
		return {
			rectangles: [],
			lines: [],
		}
	},

	/*mounted() {
		let dir = 1
		let selectedVal = Math.floor(Math.random() * this.chartValues.length)

		setInterval(() => {
			if(Math.random() > 0.995) dir *= -1
			if(Math.random() > 0.99)
				selectedVal = Math.floor(Math.random() * this.chartValues.length)

			this.chartValues[selectedVal].val = Math.min(
				Math.max(this.chartValues[selectedVal].val + dir * 0.5, 0),
				100
			)
		}, 16)
	},*/
})

</script>