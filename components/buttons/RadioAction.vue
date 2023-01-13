<template>
	<button :class="classList" :disabled="disabled" @click="toggle">
		<slot />
	</button>
</template>
<script>
import Vue from 'vue'

export default Vue.component('RadioAction', {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		outlined: {
			type: Boolean,
			default: false,
		},
		block: {
			type: Boolean,
			default: false,
		},
		value: {
			type: [String, Number, Boolean],
		},
		data: {
			type: [String, Number, Boolean],
			required: true,
		},
	},

	computed: {
		classList() {
			let classList = ['btn']

			if(this.block === true) {
				classList.push('block w-full')
			}

			if(this.outlined) {
				classList.push('outlined')
			}

			if(this.disabled === true) {
				classList.push('disabled')
			}
			else {
				classList.push('enabled')
				
				if(this.isChecked) {
					classList.push('success')
				}
			}

			return classList.join(' ')
		},

		isChecked() {
			return this.value === this.data
		},

		icon() {
			return this.isChecked ? 'radio-checked' : 'radio-unchecked'
		},
	},

	methods: {
		toggle() {
			this.$emit('input', this.data)
		},
	},
})
</script>