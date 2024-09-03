<template>
	<span>
		<d-button sm @click="openLinkModal" :disabled="disabled" :neutral="highlight">
			<d-tooltip title="Insert link">
				<icon-view icon="link" />
			</d-tooltip>
		</d-button>
		<d-card v-if="showLinkModal" compact class="link-modal w-96 absolute z-10 shadow-lg shadow-black" ref="modal">
			<template v-if="isEditing">
				<div class="flex">
					<div class="flex-grow">
						<a :href="this.editingData.href" class="link text-primary text-lg" target="_blank">{{ this.editingData.title }}</a>
					</div>
					<div class="flex-initial">
						<d-button v-if="isEditing" sm ghost @click="removeLink">
							<icon-view icon="unlink" />
						</d-button>
					</div>
					<div class="flex-initial">
						<d-button sm ghost @click="closeLinkModal">
							<icon-view icon="close" />
						</d-button>
					</div>
				</div>
				<div>{{ this.editingData.href }}</div>
			</template>
			<template v-else>
				<div class="flex gap-2">
					<div class="flex-grow">
						<label class="input input-bordered flex items-center gap-2">
							<icon-view icon="search" />
							<input type="text" v-model="searchTerm" class="grow" placeholder="Search" />
						</label>
					</div>
					<div class="flex-initial">
						<d-button sm ghost class="mt-2" @click="closeLinkModal">
							<icon-view icon="close" />
						</d-button>
					</div>
				</div>
				<div class="h-28 overflow-y-auto">
					<ul class="menu p-0">
						<li v-for="link in links" :key="link.url">
							<a @click="createLink(link)">
								<icon-view :icon="link.icon" />
								{{ link.text }}
							</a>
						</li>
					</ul>
				</div>
			</template>
		</d-card>
	</span>
</template>
<script>

import Vue from 'vue'
import { TextSelection } from 'prosemirror-state'
import { notNull } from 'vue-daisy-ui/utils/assert'
import { isVagueUrl, hasProtocol } from 'vue-daisy-ui/utils/string'
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
			searchTerm: '',
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
		isEditing() {
			return notNull(this.editingData)
		},

		links() {
			// TODO may need to debounce or at least handle async responses
			const result = this.linkSearch(this.searchTerm)

			// if searchTerm vaguely looks like a URL add it to the list
			if(hasProtocol(this.searchTerm) && URL.canParse(this.searchTerm)) {
				const url = new URL(this.searchTerm)

				result.push({
					text: url.hostname,
					url: this.searchTerm,
					icon: 'web',
				})
			}
			else if(isVagueUrl(this.searchTerm)) {
				result.push({
					text: this.searchTerm,
					url: `https://${this.searchTerm}`,
					icon: 'web',
				})
			}

			return result
		},
	},

	methods: {
		closeLinkModal() {
			this.searchTerm = ''
			this.editingData = null
			this.showLinkModal = false
		},

		openLinkModal() {
			this.searchTerm = ''
			this.editingData = null
			this.showLinkModal = true
			this.suppressClose = true

			const { $anchor } = this.editor.selection
			const node = $anchor.doc.nodeAt($anchor.pos)
			const linkMarks = node.marks.filter(m => m.type.name === MARKS.LINK)
			const nodeStart = $anchor.pos - $anchor.textOffset

			// the selection is on a link, set data needed for update
			if(linkMarks.length > 0) {
				this.editingData = {
					// start position of the link node
					from: nodeStart,
					// end position of the link node (basically, text  range)
					to: nodeStart + node.nodeSize,
					// the type of mark to be created
					markType: linkMarks[0].type,
					// current mark attributes
					href: linkMarks[0].attrs.href,
					title: linkMarks[0].attrs.title,
				}
			}

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
				const mark = this.editingData.markType.create({
					href: this.editingData.href,
					title: this.editingData.title,
				})
				const { tr } = this.editor.state
				const { from, to } = this.editingData

				tr
					.removeMark(from, to, mark)
					.setSelection(TextSelection.create(tr.doc, from)) // BUG this doesn't set the selection, it selects the entire paragraph
				this.editor.view.dispatch(tr)
			}

			this.closeLinkModal()
		},

		createLink(link) {
			const attrs = {
				href: link.url,
				title: link.text,
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
