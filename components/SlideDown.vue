<template>
	<transition
		name="slide-down"
		@enter="start"
		@after-enter="end"
		@before-leave="start"
		@after-leave="end"
	>
		<slot />
	</transition>
</template>
<script>
import Vue from 'vue'

export default Vue.component('SlideDown', {
	methods: {
		start(el) {
			el.style.height = el.scrollHeight + 'px'
		},

		end(el) {
			el.style.height = ''
		},
	},
})
</script>
<style>
.slide-down-enter-active, .slide-down-leave-active {
	will-change: height, opacity;
	transition: height 0.5s ease, opacity 0.5s ease;
	overflow: hidden;
}

.slide-down-enter, .slide-down-leave-to {
	height: 0 !important;
	opacity: 0;
}
</style>
