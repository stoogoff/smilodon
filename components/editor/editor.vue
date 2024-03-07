<template>
	<div class="form-control">
		<div class="label">
			<span class="label-text">{{ label }}</span>
		</div>
		<slot v-bind:editor="editor">
			<!-- div v-if="editor">
				<d-dropdown>
					<template #activator>
						<div class="btn btn-sm w-52" role="button" tabindex="0">Text</div>
					</template>
					<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 prose">
						<li class="border-b" @click="command(setBlockType(schema.nodes.paragraph))"><span>Paragraph</span></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 1 }))"><h1 class="my-0">Heading 1</h1></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 2 }))"><h2 class="my-0">Heading 2</h2></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 3 }))"><h3 class="my-0">Heading 3</h3></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 4 }))"><h4 class="my-0">Heading 4</h4></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 5 }))"><h5 class="my-0">Heading 5</h5></li>
						<li @click="command(setBlockType(schema.nodes.heading, { level: 6 }))"><h6 class="my-0">Heading 6</h6></li>
					</ul>
				</d-dropdown>
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						:command="toggleMark(schema.marks.strong)"
						icon="format-bold" />
					<command-button
						class="join-item"
						:editor="editor"
						:command="toggleMark(schema.marks.em)"
						icon="format-italic" />
					<command-button
						class="join-item"
						:editor="editor"
						:command="toggleMark(schema.marks.code)"
						icon="format-code" />
				</d-join>
				<d-join>
					<command-button
						class="join-item"
						:editor="editor"
						:command="wrapIn(schema.nodes.bullet_list)"
						icon="list-bullet" />
					<command-button
						class="join-item"
						:editor="editor"
						:command="wrapIn(schema.nodes.ordered_list)"
						icon="list-number" />
				</d-join>
				<command-button
					:editor="editor"
					:command="wrapIn(schema.nodes.blockquote)"
					icon="format-blockquote" />
			</div -->
		</slot>
		<div ref="editor" class="textarea textarea-bordered relative prose" />
		<pre>{{ value }}</pre>
	</div>
</template>
<script>

import Vue from 'vue'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
	schema,
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import { toggleMark, setBlockType, wrapIn } from'prosemirror-commands'
import { exampleSetup } from 'prosemirror-example-setup'


import MarkdownEditor from './markdown-editor'


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
		}
	},

	mounted() {
		this.editor = new MarkdownEditor(
			this.$refs.editor,
			content => {
				this.lastValue = content
				this.$emit('input', content)
			}
		)
	},

	watch: {
		value(newValue) {
			if(newValue !== this.lastValue) {
				this.editor.content = newValue
			}
		},
	},

	methods: {
		command(cmd) {
			//this.editor.focus()
			//cmd(this.editor.state, this.editor.dispatch, this.editor)
		},
	},

	computed: {
		schema() {
			return schema
		},

		toggleMark() {
			return toggleMark
		},

		wrapIn() {
			return wrapIn
		},

		setBlockType() {
			return setBlockType
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