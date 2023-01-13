<template>
	<div>
		<validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
			<text-input label="Title" v-model="title" :error="error" :message="message" />
		</validate-field>
		<validate-field :value="summary" :rules="rules.summary" v-slot="{ error, message }">
			<text-area label="Summary" v-model="summary" :error="error" :message="message" />
		</validate-field>
		<div class="fixed bottom-0 left-0 right-0 p-2">
			<button-action type="primary" block>Save</button-action>
		</div>
	</div>
</template>
<script>
import { required } from '~/utils/validators'

export default {
	name: 'PostPage',

	data() {
		return {
			title: '',
			summary: '',
			error: false,
		}
	},

	computed: {
		rules() {
			return {
				title: [required()],
				summary: [required()],
			}
		},
	},
}
</script>