<template>
	<div
		class="relative"
		:class="{
			'block w-full': block,
			'inline-block': !block,
		}"
		@focus="show"
		@focusout="hide"
		tabindex="0"
	>
		<we-button-action v-bind="$attrs" block :disabled="disabled" @click="toggle">
			<slot />
		</we-button-action>
		<transition
			enter-active-class="transition duration-300 ease-out transform"
			enter-class="translate-y-3 scale-95 opacity-0"
			enter-to-class="translate-y-0 scale-100 opacity-100"
			leave-active-class="transition duration-150 ease-in transform"
			leave-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-3 opacity-0"
		>
			<div
				v-show="isVisible"
				class="absolute pt-2 z-10 bg-white shadow"
				:class="{
					'w-64': !wide,
					'w-96': wide,
					'bottom-12': y === 'bottom',
					'top-12': y !== 'bottom',
					'left-0': x === 'left',
					'right-0': x !== 'left',
				}"
			>
				<slot name="popup" />
			</div>
		</transition>
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
