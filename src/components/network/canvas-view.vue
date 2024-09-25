<template>
	<div>
		<canvas ref="canvas"></canvas>
		<slot></slot>
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('CanvasView', {
	data() {
		return {
			provider: {
				context: null,
			},
		}
	},

	provide() {
		return {
			provider: this.provider,
		}
	},

	mounted() {
		const canvas = this.$refs['canvas']

		this.provider.context = canvas.getContext('2d')

		this.$refs['canvas'].width = canvas.parentElement.clientWidth
		this.$refs['canvas'].height = canvas.parentElement.clientHeight
	},
})

</script>
