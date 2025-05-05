<template>
	<div>
		<div class="carousel w-full" ref="container">
			<figure
				v-for="(item, index) in items"
				:key="`image_${item}`"
				class="carousel-item w-full"
				:id="`item_${index}`"
			>
				<img :src="item" />
			</figure>
		</div>
		<div class="flex w-full justify-center gap-2 py-2">
			<a
				v-for="(item, index) in items"
				:key="`image_${item}`"
				:href="`#item_${index}`" class="btn btn-xs">{{ index + 1 }}</a>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('Carousel', {
	props: {
		items: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			timer: null,
			index: 0,
		}
	},

	mounted() {
		/*const node = this.$refs.container

		this.timer = window.setInterval(() => {
			const scrolling = {
				block: 'nearest',
				inline: 'nearest',
			}

			if(++this.index >= node.children.length) {
				this.index = 0
				scrolling.behavior = 'instant'
			}

			node.children[this.index].scrollIntoView(scrolling)
		}, 10000)*/
	},

	onBeforeDestroy() {
		if(this.timer) {
			window.clearInterval(this.timer)
		}
	},
})

</script>
<style scoped>

.carousel {
	@apply inline-flex overflow-x-scroll;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
	@apply hidden;
}

.carousel-item {
	@apply box-content flex flex-none;
	scroll-snap-align: start;
}

</style>
