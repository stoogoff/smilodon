<template>
	<span>
		<d-join>
			<d-button
				class="join-item"
				sm
				@click="openLinkModal"
				:disabled="disabled"
				:neutral="highlight"
			>
				<icon-view icon="link" />
			</d-button>
			<command-button
				class="join-item"
				:editor="editor"
				command="link"
				icon="unlink" />
		</d-join>
		<confirm-dialogue
			v-if="showLinkModal"
			title="Link"
			show-cancel
			@cancel="closeLinkModal"
			@confirm="createLink"
		>
			<d-validator-control
				label="URL"
				:value="url"
				:rules="rules.url"
				v-slot="{ error }"
			>
				<d-input v-model="url" bordered sm :error="error" />
			</d-validator-control>
		</confirm-dialogue>
	</span>
</template>
<script>

import Vue from 'vue'
import { required } from 'vue-daisy-ui/utils/validators'
import { MARKS } from './config'

export default Vue.component('LinkButtons', {
	props: {
		editor: {
			type: Object,
			required: true,
		},
		highlight: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			showLinkModal: false,
			url: '',
		}
	},

	computed: {
		rules() {
			return {
				url: [required()],
			}
		}
	},

	methods: {
		closeLinkModal() {
			this.showLinkModal = false
		},

		openLinkModal() {
			this.showLinkModal = true
		},

		createLink() {
			// TODO check for an existing link and edit its URL
			// TODO unlink should only be enabled if a link is selected
			// TODO properties should better define this state, something like
			// is-link (if the selected text is a link)
			// can-link (selected text which isn't empty)

			this.editor.toggle(MARKS.LINK, {
				href: this.url,
			})
			this.url = ''
			this.closeLinkModal()
		},
	},
})

</script>