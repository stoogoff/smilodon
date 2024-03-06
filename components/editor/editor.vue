<template>
	<div class="form-control">
		<div class="label">
			<span class="label-text">{{ label }}</span>
		</div>
		<slot>
			<div v-if="editor">
				<d-join>
					<command-action
						class="join-item"
						:command="editor.chain().focus().toggleBold().run"
						icon="format-bold" />
					<command-action
						class="join-item"
						:command="editor.chain().focus().toggleItalic().run"
						icon="format-italic" />
					<command-action
						class="join-item"
						:command="editor.chain().focus().toggleCode().run"
						icon="format-code" />
				</d-join>
				<d-join>
					<command-action
						class="join-item"
						:command="editor.chain().focus().toggleBulletList().run"
						icon="list-bullet" />
					<command-action
						class="join-item"
						:command="editor.chain().focus().toggleOrderedList().run"
						icon="list-bullet" />
				</d-join>
			</div>
		</slot>
		<!-- div ref="editor" class="textarea textarea-bordered relative prose" / -->
		<client-only>
			<editor-content
				:editor="editor"
				class="textarea textarea-bordered relative prose" />
		</client-only>
		<pre>{{ value }}</pre>
	</div>
</template>
<script>

import Vue from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

export default Vue.component('Editor', {
	components: {
		EditorContent,
	},

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
			editor: null,
		}
	},

	mounted() {
		this.editor = new Editor({
			content: this.value,
			extensions: [
				StarterKit,
				/*Markdown/*.configure({
					tightLists: true,
					transformPastedText: true,
					transformCopiedText: true,
				})*/,
			],
			onUpdate: () => {
				console.log({ ...this.editor.getJSON() })
				this.$emit('input', this.editor.getHTML())
				//this.$emit('input', this.editor.storage.markdown.getMarkdown())
			},
		})
	},

	beforeDestroy() {
		this.editor.destroy()
	},

	watch: {
		value(newValue) {
			if(this.editor.getHTML() !== newValue) {
				this.editor.commands.setContent(newValue)
			}
		}
	},
})

</script>
<style>
.ProseMirror {
	outline: none;
}
</style>