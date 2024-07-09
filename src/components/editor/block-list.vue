<template>
	<d-dropdown class="-top-1">
		<template #activator>
			<button class="btn btn-sm menu-dropdown-show" role="button" tabindex="0">
				{{ selection }}
				<svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
				</svg>
			</button>
		</template>
		<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 prose">
			<li class="border-b" @click="editor.block('paragraph')"><span>Paragraph</span></li>
			<li @click="editor.block('heading_1')"><h1>Heading 1</h1></li>
			<li @click="editor.block('heading_2')"><h2>Heading 2</h2></li>
			<li @click="editor.block('heading_3')"><h3>Heading 3</h3></li>
			<li @click="editor.block('heading_4')"><h4>Heading 4</h4></li>
			<li @click="editor.block('heading_5')"><h5>Heading 5</h5></li>
			<li @click="editor.block('heading_6')"><h6>Heading 6</h6></li>
		</ul>
	</d-dropdown>
</template>
<script>

import Vue from 'vue'
import { toTitleCase } from 'vue-daisy-ui/utils/string'
import { NODES, EVENTS } from './config'

export default Vue.component('BlockList', {
	props: {
		editor: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			stateRef: null,
			selection: 'Paragraph',
		}
	},

	mounted() {
		this.stateRef = this.editor.on(EVENTS.STATE, state => {
			let name = state.selection.$anchor.parent.type.name

			if(name !== NODES.PARAGRAPH) {
				name = `${name} ${state.selection.$anchor.parent.attrs.level}`
			}

			this.selection = toTitleCase(name)
		})
	},

	beforeDestroy() {
		this.editor.off(EVENTS.STATE, this.stateRef)
	}
})

</script>
<style scoped>
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
	@apply my-0;
}
</style>