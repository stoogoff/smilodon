<template>
	<span>
		<d-button sm @click="openLinkModal" :disabled="disabled" :neutral="highlight">
			<d-tooltip title="Insert link">
				<icon-view icon="link" />
			</d-tooltip>
		</d-button>
		<d-card v-show="showLinkModal" compact class="link-modal w-96 absolute z-10" ref="modal">
			<div class="flex gap-2">
				<div class="flex-1">
					<d-validator-control
						label="URL"
						:value="url"
						:rules="rules.url"
						v-slot="{ error }"
					>
						<d-input v-model="url" bordered sm :error="error" />
					</d-validator-control>
				</div>
				<div class="flex-initial">
					<d-button sm ghost class="mt-9" @click="createLink">
						<icon-view icon="edit" sm />
					</d-button>
					<d-button sm ghost class="mt-9" @click="closeLinkModal">
						<icon-view icon="close" sm />
					</d-button>
				</div>
			</div>
		</d-card>
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
			suppressClose: false,
		}
	},

	mounted() {
		document.addEventListener('click', (event) => {
			if(notNull(event.target.closest('.link-modal'))) return

			Vue.nextTick(() => {
				if(!this.suppressClose) {
					this.showLinkModal = false
				}

				this.suppressClose = false
			})
		})
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
			this.url = '' // TODO this causes the form to error, messages need to be reset
			this.showLinkModal = false
			this.editingData = null
		},

		openLinkModal() {
			this.editingData = null
			this.suppressClose = true

			const { $anchor } = this.editor.selection
			const node = $anchor.doc.nodeAt($anchor.pos)
			const linkMarks = node.marks.filter(m => m.type.name === MARKS.LINK)
			const nodeStart = $anchor.pos - $anchor.textOffset

			// the selection is on a link, set data needed for update
			if(linkMarks.length > 0) {

				this.url = linkMarks[0].attrs.href || ''
				this.editingData = {
					// start position of the link node
					from: nodeStart,
					// end position of the link node (basically, text  range)
					to: nodeStart + node.nodeSize,
					// the type of mark to be created
					markType: linkMarks[0].type,
				}
			}

			this.showLinkModal = true

			Vue.nextTick(() => {
				// set the position of the modal
				const startPos = this.editor.view.coordsAtPos(nodeStart)
				const { $el } = this.$refs.modal
				const offsetBox = $el.offsetParent.getBoundingClientRect()
				const left = startPos.left - offsetBox.left

				$el.style.left = left + 'px'
				$el.style.top = (startPos.bottom - offsetBox.top + 2) + 'px'

				// if the modal right edge is off screen reposition
				const elBox = $el.getBoundingClientRect()

				if(elBox.right > offsetBox.right) {
					$el.style.left = (left - (elBox.right - offsetBox.right - 5)) + 'px'
				}
			})
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