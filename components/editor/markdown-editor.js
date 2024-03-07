
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

export default class MarkdownEditor {
	constructor(node, onUpdate) {
		this.view = new EditorView(node, {
			state: createState(''),
			dispatchTransaction: tx => {
				const newState = this.view.state.apply(tx)

				this.view.updateState(newState)

				onUpdate(this.content)
			},
		})
	}

	get content() {
		return defaultMarkdownSerializer.serialize(this.view.state.doc)
	}

	set content(content) {
		this.view.updateState(createState(content))
	}

	focus() {
		this.view.focus()
	}

	destroy() {
		this.view.destroy()
	}

	// TODO command methods for toggling e.g. bold

	is(type) {
		// return true if the nearest appropriate parent is of the supplied
	}
}