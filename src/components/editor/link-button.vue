<template>
	<span>
		<d-button sm @click="openLinkModal" :disabled="disabled" :neutral="highlight">
			<d-tooltip title="Insert link">
				<icon-view icon="link" />
			</d-tooltip>
		</d-button>
		<d-card v-if="showLinkModal" compact class="link-modal w-96 absolute z-10 shadow-lg shadow-black" ref="modal">
			<div class="card-actions justify-end">
				<d-button sm ghost @click="closeLinkModal">
					<icon-view icon="close" />
				</d-button>
			</div>
			<div class="flex gap-2">
				<div class="flex-1">
					<label class="input input-bordered flex items-center gap-2">
						<icon-view icon="search" />
						<input type="text" v-model="url" class="grow" placeholder="Search" />
					</label>

					<!-- d-validator-control
						label="Search"
						:value="url"
						:rules="rules.url"
						v-slot="{ error }"
					>
						<d-input v-model="url" bordered sm :error="error" />
					</d-validator-control -->
				</div>
				<div class="flex-initial">
					<!-- d-button ghost @click="createLink">
						<icon-view icon="edit" />
					</d-button -->
					<d-button v-if="isEditing" sm ghost class="mt-9" @click="removeLink">
						<icon-view icon="unlink" />
					</d-button>
				</div>
			</div>
			<!-- TODO this needs to scroll -->
			<ul class="menu p-0">
				<li v-for="link in links" :key="link.url">
					<a @click="createLink(link.url)">
						<icon-view :icon="link.icon" />
						{{ link.text }}
					</a>
				</li>
			</ul>
		</d-card>
	</span>
</template>
<script>

import Vue from 'vue'
import { required } from 'vue-daisy-ui/utils/validators'
import { notNull } from 'vue-daisy-ui/utils/assert'
import { MARKS } from './config'

// TODO editing is going to need to work differently

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
		linkSearch: {
			type: Function,
			default: search => [],
		},
	},

	data() {
		return {
			showLinkModal: false,
			url: '', // this should be searchTerm
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
		// is this still used?
		rules() {
			return {
				url: [required()],
			}
		},

		isEditing() {
			return notNull(this.editingData)
		},

		links() {
			// TODO may need to debounce
			// TODO needs to handle actual URLs as well
			console.log(this.url)
			const result = this.linkSearch(this.url)
			console.log('search result', result)
			return result
		},
	},

	methods: {
		closeLinkModal() {
			this.url = ''
			this.showLinkModal = false
			this.editingData = null
		},

		openLinkModal() {
			this.editingData = null
			this.suppressClose = true
			this.url = ''

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

		removeLink() {
			if(notNull(this.editingData)) {
				const mark = this.editingData.markType.create({ href: this.url })
				const tr = this.editor.state.tr

				tr.removeMark(this.editingData.from, this.editingData.to, mark)
				this.editor.view.dispatch(tr)
			}

			this.closeLinkModal()
		},

		createLink(href) {
			const attrs = {
				href, //this.url // url is  probably not going to be used like this
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