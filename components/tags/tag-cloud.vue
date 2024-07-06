<template>
	<div>
		<d-badge
			v-for="tag in tags"
			:key="`tag_cloud_${ tag.title }`"
			:xs="isTiny(tag)"
			:sm="isSmall(tag)"
			:md="isMedium(tag)"
			:lg="isLarge(tag)"
			:ghost="isSmallest(tag)"
			:neutral="!isSmallest(tag) && !isMedium(tag) && !isLarge(tag)"
			:primary="isLargest(tag)"
			:secondary="isMedium(tag)"
			:info="isLarge(tag) && !isLargest(tag)"
			class="mr-1 mb-1 rounded"
		>{{ tag.title }}</d-badge>
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('TagCloud', {
	props: {
		tags: {
			type: Array,
			required: true,
		},
	},

	computed: {
		max() {
			if(!this.tags || this.tags.length === 0) return 1

			return this.tags.reduce((a, c) => Math.max(a, c.count), 0)
		},

		min() {
			if(!this.tags || this.tags.length === 0) return 0

			return this.tags.reduce((a, c) => Math.min(a, c.count), this.max)
		},

		spread() {
			return (this.max - this.min) / 4
		},
	},

	methods: {
		isTiny(tag) {
			return tag.count <= this.spread
		},

		isSmall(tag) {
			return tag.count > this.spread && tag.count <= (this.spread * 2)
		},

		isMedium(tag) {
			return tag.count > (this.spread * 2) && tag.count <= (this.spread * 3)
		},

		isLarge(tag) {
			return tag.count > (this.spread * 3)
		},

		isSmallest(tag) {
			return tag.count === this.min
		},

		isLargest(tag) {
			return tag.count === this.max
		},
	},
})

</script>
