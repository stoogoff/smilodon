<template>
	<span>
		<d-button sm @click="openLinkModal" :disabled="disabled" :neutral="highlight">
			<d-tooltip title="Insert link">
				<icon-view icon="link" />
			</d-tooltip>
		</d-button>
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
import { notNull } from 'vue-daisy-ui/utils/assert'
import { MARKS } from './config'

export default Vue.component('LinkButton', {
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
			editingData: null,
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
			this.url = ''
			this.showLinkModal = false
			this.editingData = null
		},

		openLinkModal() {
			this.editingData = null

			const anchor = this.editor.selection.$anchor
			const node = anchor.doc.nodeAt(anchor.pos)
			const linkMarks = node.marks.filter(m => m.type.name === MARKS.LINK)

			if(linkMarks.length > 0) {
				this.url = linkMarks[0].attrs.href || ''
				this.editingData = {
					from: anchor.pos - anchor.textOffset,
					to: anchor.pos - anchor.textOffset + node.nodeSize,
					markType: linkMarks[0].type,
				}
			}

			this.showLinkModal = true
		},

		createLink() {
			const attrs = {
				href: this.url
			}

			if(notNull(this.editingData)) {
				const mark = this.editingData.markType.create(attrs)
				const tr = this.editor.state.tr

				tr.addMark(this.editingData.from, this.editingData.to, mark)
				this.editor.view.dispatch(tr)
			}
			else {
				this.editor.toggle(MARKS.LINK, attrs)
			}

			this.closeLinkModal()
		},
	},
})

</script>