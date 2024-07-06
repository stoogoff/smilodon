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
						icon="formatBold" />
					<command-button
						class="join-item"
						:editor="editor"
						command="em"
						icon="formatItalic" />
					<command-button
						class="join-item"
						:editor="editor"
						command="code"
						icon="formatCode" />
				</d-join>
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						command="bullet_list"
						icon="listBullet" />
					<command-button
						class="join-item"
						:editor="editor"
						command="ordered_list"
						icon="listNumber" />
				</d-join>
				<command-button
					:editor="editor"
					command="blockquote"
					icon="formatBlockquote" />
				<d-button sm @click="fullScreen = false" v-if="fullScreen">
					<icon-view icon="fullscreenExit" />
				</d-button>
				<d-button sm @click="fullScreen = true" v-else>
					<icon-view icon="fullscreen" />
				</d-button>
			</div>
		</slot>
		<div ref="editor" class="textarea textarea-bordered relative prose" />
	</div>
</template>
<script>

import Vue from 'vue'
import MarkdownEditor from './markdown-editor'
import { EVENTS } from './config'

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
			updateRef: null,
			fullScreen: false,
		}
	},

	mounted() {
		this.editor = new MarkdownEditor(this.$refs.editor)
		this.updateRef = this.editor.on(EVENTS.CONTENT, content => {
			if(content !== this.lastValue) {
				this.lastValue = content
				this.$emit('input', content)
			}
		})
	},

	beforeDestroy() {
		this.editor.off(EVENTS.CONTENT, this.updateRef)
		this.editor.destroy()
	},

	watch: {
		value(newValue) {
			if(newValue !== this.lastValue) {
				this.editor.content = newValue
			}
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