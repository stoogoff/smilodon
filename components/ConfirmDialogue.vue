<template>
	<we-overlay-fade>
		<div class="relative p-4 w-full max-w-2xl max-h-full">
			<div class="relative bg-white rounded-lg shadow">
				<div class="flex items-center justify-between p-2 md:p-4 border-b rounded-t">
					<h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
					<button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal" @click="$emit('cancel')">
						<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<div class="p-2 md:p-4 space-y-4">
					<slot />
				</div>
				<div class="flex justify-end p-2 md:p-4 border-t border-gray-200 rounded-b">
					<we-button-action v-if="showCancel" @click="$emit('cancel')">Cancel</we-button-action>
					<we-button-action type="primary" @click="$emit('confirm')">Confirm</we-button-action>
				</div>
			</div>
		</div>
	</we-overlay-fade>
</template>
<script>

import Vue from 'vue'

export default Vue.component('ConfirmDialogue', {
	props: {
		title: {
			type: String,
			required: true,
		},
		showCancel: {
			type: Boolean,
			default: false,
		},
	},
})

</script>