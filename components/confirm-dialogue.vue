<template>
	<d-modal :show-cancel="showCancel">
		<h3 class="text-lg font-bold">{{ title }}</h3>
		<slot />
		<div class="modal-action">
			<d-button v-if="showCancel" @click="$emit('cancel')">Cancel</d-button>
			<d-button primary @click="$emit('confirm')">Confirm</d-button>
		</div>
	</d-modal>
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