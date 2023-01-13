<template>
	<div
		class="flex cursor-pointer"
		:class="{ 'text-blue-500': isChecked, 'text-grey-500': !isChecked }"
		@click="toggle"
	>
		<icon-view :icon="icon" />
		<span v-if="label" class="ml-2">{{ label }}</span>
	</div>
</template>
<script>
import Vue from 'vue'

export default Vue.component('RadioGroup', {
	props: {
		label: {
			type: String,
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