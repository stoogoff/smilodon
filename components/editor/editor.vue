<template>
	<div class="form-control">
		<div class="label">
			<span class="label-text">{{ label }}</span>
		</div>
		<slot v-bind:editor="editor">
			<div v-if="editor">
				<block-list :editor="editor" />
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						command="strong"
						icon="format-bold" />
					<command-button
						class="join-item"
						:editor="editor"
						command="em"
						icon="format-italic" />
					<command-button
						class="join-item"
						:editor="editor"
						command="code"
						icon="format-code" />
				</d-join>
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						command="bullet_list"
						icon="list-bullet" />
					<command-button
						class="join-item"
						:editor="editor"
						command="ordered_list"
						icon="list-number" />
				</d-join>
				<command-button
					:editor="editor"
					command="blockquote"
					icon="format-blockquote" />
			</div>
		</slot>
		<div ref="editor" class="textarea textarea-bordered relative prose" />
		<pre>{{ value }}</pre>
	</div>
</template>
<script>

import Vue from 'vue'
import MarkdownEditor, { EVENTS } from './markdown-editor'

const createState = content => EditorState.create({
	doc: defaultMarkdownParser.parse(content),
	plugins: exampleSetup({ schema, menuBar: false }),
})

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

</style>