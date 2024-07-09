<template>
	<div
		class="dropdown"
		:class="{
			'block w-full': block,
			'inline-block': !block,
		}"
		@focus="show"
		@focusout="hide"
		tabindex="0">
		<button
			class="btn btn-ghost btn-sm"
			type="button"
			@click="toggle"
			ref="button">
			<slot />
			<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
			</svg>
		</button>
		<div
			v-show="isVisible"
			class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box"
			:class="{
				'w-64': !wide,
				'w-96': wide,
				'left-0': x === 'left',
				'right-0': x !== 'left',
			}"
			@click="hide"
		>
			<slot name="popup" />
		</div>
	</div>
</template>
<script>
import Vue from 'vue'

export default Vue.component('PopupButton', {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		block: {
			type: Boolean,
			default: false,
		},
		wide: {
			type: Boolean,
			default: false,
		},
		y: {
			type: String,
			default: 'bottom',
		},
		x: {
			type: String,
			default: 'left'
		}
	},

	data() {
		return {
			isVisible: false
		}
	},

	methods: {
		show() {
			if(!this.disabled) {
				this.isVisible = true
			}
		},

		hide() {
			this.isVisible = false
		},

		toggle() {
			if(this.isVisible) {
				this.hide()
			}
			else {
				this.show()
			}
		},
	},
})
</script>
