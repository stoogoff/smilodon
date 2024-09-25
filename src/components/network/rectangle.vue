<script>

import Vue from 'vue'

export default Vue.component('CRectangle', {
	inject: ['provider'],

	props: {
		x: {
			type: Number,
			default: 0,
		},
		y: {
			type: Number,
			default: 0,
		},
		width: {
			type: Number,
			default: 0,
		},
		height: {
			type: Number,
			default: 0,
		},
		colour: {
			type: String,
			default: '#F00',
		},
		text: {
			type: String,
			required: false,
		},
	},

	render() {
		if(!this.provider.context) return

		const ctx = this.provider.context

		ctx.beginPath()
		ctx.clearRect(this.x, this.y, this.width, this.height)

		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = this.colour
		ctx.fill()

		if(this.text) {
			ctx.fillStyle = '#000'
			ctx.font = '12pt sans-serif'
			ctx.textAlign = 'center'
			ctx.fillText(
				this.text,
				this.x + this.width / 2,
				this.y + this.height / 2
			)
		}
	},
})
</script>
