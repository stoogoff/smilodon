<template>
	<div :class="{
		'form-control': !fullScreen,
		'full-screen': fullScreen,
	}">
		<div class="label" v-if="!fullScreen">
			<span class="label-text">{{ label }}</span>
		</div>
		<slot v-bind:editor="editor">
			<div v-if="editor" class="toolbar">
				<block-list :editor="editor" />
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						command="strong"
						icon="formatBold"
						:highlight="isBold" />
					<command-button
						class="join-item"
						:editor="editor"
						command="em"
						icon="formatItalic"
						:highlight="isItalic" />
					<command-button
						class="join-item"
						:editor="editor"
						command="code"
						icon="formatCode"
						:highlight="isCode" />
				</d-join>
				<link-button
					:editor="editor"
					:disabled="!isLink" />
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						command="bullet_list"
						icon="listBullet"
						:highlight="isBulletList" />
					<command-button
						class="join-item"
						:editor="editor"
						command="ordered_list"
						icon="listNumber"
						:highlight="isOrderedList" />
				</d-join>
				<command-button
					:editor="editor"
					command="blockquote"
					icon="formatBlockquote"
					:highlight="isBlockquote" />
				<d-button sm @click="fullScreen = false" v-if="fullScreen">
					<d-tooltip title="Exit full screen">
						<icon-view icon="fullscreenExit" />
					</d-tooltip>
				</d-button>
				<d-button sm @click="fullScreen = true" v-else>
					<d-tooltip title="Enter full screen">
						<icon-view icon="fullscreen" />
					</d-tooltip>
				</d-button>
			</div>
		</slot>
		<div ref="editor" class="textarea textarea-bordered relative prose" />
		<div class="toolbar">
			<small>Words: {{ wordCount }}</small>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import MarkdownEditor from './markdown-editor'
import { NODES, MARKS, EVENTS } from './config'

export default Vue.component('Editor', {
	props: {
		label: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			lastValue: null,
			editor: null,
			contentRef: null,
			stateRef: null,
			fullScreen: false,

			isBold: false,
			isItalic: false,
			isCode: false,
			isLink: false,

			isBulletList: false,
			isOrderedList: false,
			isBlockquote: false,
		}
	},

	mounted() {
		this.editor = new MarkdownEditor(this.$refs.editor)
		this.contentRef = this.editor.on(EVENTS.CONTENT, content => {
			if(content !== this.lastValue) {
				this.lastValue = content
				this.$emit('input', content)
			}
		})

		this.stateRef = this.editor.on(EVENTS.STATE, state => {
			// inline state
			let marks = this.editor.selectedMarks()

			this.isBold = marks[MARKS.STRONG]
			this.isItalic = marks[MARKS.EM]
			this.isCode = marks[MARKS.CODE]
			this.isLink = marks[MARKS.LINK] || !this.editor.selection.empty

			// block level state
			let node = this.editor.selectedNode()

			this.isBlockquote = node[NODES.BLOCKQUOTE]
			this.isBulletList = node[NODES.LIST_BULLET]
			this.isOrderedList = node[NODES.LIST_ORDERED]
		})
	},

	beforeDestroy() {
		this.editor.off(EVENTS.CONTENT, this.contentRef)
		this.editor.off(EVENTS.STATE, this.stateRef)
		this.editor.destroy()
	},

	watch: {
		value(newValue) {
			if(newValue !== this.lastValue) {
				this.editor.content = newValue
			}
		},
	},

	computed: {
		wordCount() {
			return this.value === '' ? 0 : this.value.replace(/\W/g, ' ').split(/\s+/).length
		},
	},
})

</script>
<style>

.ProseMirror {
	outline: none;
	word-wrap: break-word;
	white-space: pre-wrap;
	-webkit-font-variant-ligatures: none;
	font-variant-ligatures: none;
}

.full-screen {
	@apply fixed top-0 left-0 bottom-0 right-0 z-[10] p-10 bg-base-300;
}
.full-screen .textarea, .full-screen .toolbar {
	@apply max-w-4xl mx-auto;
}

</style>