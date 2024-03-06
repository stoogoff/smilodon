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
						:editor="editor"
						:command="toggleMark(schema.marks.strong)"
						icon="format-bold" />
					<command-action
						class="join-item"
						:editor="editor"
						:command="toggleMark(schema.marks.em)"
						icon="format-italic" />
					<command-action
						class="join-item"
						:editor="editor"
						:command="toggleMark(schema.marks.code)"
						icon="format-code" />
				</d-join>
				<d-join>
					<command-action
						class="join-item"
						:editor="editor"
						:command="wrapIn(schema.nodes.bullet_list)"
						icon="list-bullet" />
					<command-action
						class="join-item"
						:editor="editor"
						:command="wrapIn(schema.nodes.ordered_list)"
						icon="list-number" />
				</d-join>
			</div>
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
			state: null,
			editor: null,
		}
	},

	mounted() {
		this.state = createState(this.value)

		this.editor = new EditorView(this.$refs.editor, {
			state: this.state,
			dispatchTransaction: tx => {
				this.state = this.state.apply(tx)
				this.editor.updateState(this.state)
				this.lastValue = defaultMarkdownSerializer.serialize(this.state.doc)
				this.$emit('input', this.lastValue)
			}
		})
	},

	watch: {
		value(newValue) {
			if(newValue !== this.lastValue) {
				this.state = createState(newValue)
				this.editor.updateState(this.state)
			}
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
	},
})

</script>
<style>
.ProseMirror {
	outline: none;
}
</style>