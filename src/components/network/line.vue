<script>

import Vue from 'vue'

export default Vue.component('CLine', {
	inject: ['provider'],

	props: {
		x1: {
			type: Number,
			default: 0,
		},
		y1: {
			type: Number,
			default: 0,
		},
		x2: {
			type: Number,
			default: 0,
		},
		y2: {
			type: Number,
			default: 0,
		},
		colour: {
			type: String,
			default: '#F00',
		},
	},

	render() {
		if(!this.provider.context) return

		const ctx = this.provider.context

		ctx.beginPath()
		ctx.moveTo(this.x1, this.y1)
		ctx.lineTo(this.x2, this.y2)
		ctx.stokeStyle = this.colour
		ctx.stroke()
	},
})
</script>
