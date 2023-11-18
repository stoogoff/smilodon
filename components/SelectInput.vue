<template>
	<we-form-field :label="label" :message="message" :error="error" v-slot="field">
		<div
			class="input select-trigger font-sans text-sm relative rounded border-2 shadow outline-none w-full px-3 py-3 cursor-pointer"
			tabindex="0"
			@click="toggleActive"
			@keypress.enter="toggleActive"
			@keypress.space.prevent="toggleActive"
		>{{ value }}&nbsp;</div>
		<transition
			name="select"
			@enter="start"
			@after-enter="end"
			@before-leave="start"
			@after-leave="end"
		>
			<div class="select-dropdown border border-t-0 absolute z-50 w-96 shadow" v-show="active">
				<div
					v-for="(item, idx) in items"
					:key="idx"
					@click="select(item)"
					@keypress.enter="select(item)"
					@keypress.space.prevent="select(item)"
					class="select-item cursor-pointer px-4 py-2 hover:bg-gray-200"
					:class="{
						'active': isSelected(item)
					}"
					tabindex="0"
				>
					{{ item }}
				</div>
			</div>
		</transition>
	</we-form-field>
</template>
<script>

import Vue from 'vue'

export default Vue.component('SelectInput', {
	props: {
		items: {
			type: Array,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			default: '',
		},
		message: {
			type: String,
			default: '',
		},
		error: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			active: false,
			suppressClose: false,
		}
	},

	mounted() {
		document.addEventListener('click', () => {
			Vue.nextTick(() => {
				if(!this.suppressClose) {
					this.active = false
				}

				this.suppressClose = false
			})
		})
	},

	methods: {
		toggleActive() {
			this.active = !this.active

			if(this.active) {
				this.suppressClose = true
			}
		},

		select(item) {
			this.$emit('input', item)
			this.active = false
		},

		isSelected(item) {
			return item === this.value
		},

		start(el) {
			el.style.height = el.scrollHeight + 'px'
		},

		end(el) {
			el.style.height = ''
		},
	},
})

</script>
<style scoped>

.select-trigger {
	background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M5.84,9.59L11.5,15.25L17.16,9.59L16.45,8.89L11.5,13.84L6.55,8.89L5.84,9.59Z" /></svg>') right center no-repeat;
}
.select-item {
	transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.select-enter-active, .select-leave-active {
	will-change: height, opacity;
	transition: height 0.5s ease, opacity 0.5s ease;
	overflow: hidden;
}

.select-enter, .select-leave-to {
	height: 0 !important;
	opacity: 0;
}

</style>