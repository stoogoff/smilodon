
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

export const MARKS = {
	STRONG: 'strong',
	EM: 'em',
	CODE: 'code',
}

export const NODES = {
	PARAGRAPH: 'paragraph',
	HEADING_1: 'heading_1',
	HEADING_2: 'heading_2',
	HEADING_3: 'heading_3',
	HEADING_4: 'heading_4',
	HEADING_5: 'heading_5',
	HEADING_6: 'heading_6',
	LIST_BULLET:'bullet_list',
	LIST_ORDERED: 'ordered_list',
	BLOCKQUOTE:  'blockquote',
}

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

	toggle(mark) {
		this.command(toggleMark(schema.marks[mark]))
	}

	wrap(node) {
		this.command(wrapIn(schema.nodes[node]))
	}

	block(node) {
		switch(node) {
			case NODES.HEADING_1:
				this.command(setBlockType(schema.nodes.heading, { level: 1 }))
				break
			case NODES.HEADING_2:
				this.command(setBlockType(schema.nodes.heading, { level: 2 }))
				break
			case NODES.HEADING_3:
				this.command(setBlockType(schema.nodes.heading, { level: 3 }))
				break
			case NODES.HEADING_4:
				this.command(setBlockType(schema.nodes.heading, { level: 4 }))
				break
			case NODES.HEADING_5:
				this.command(setBlockType(schema.nodes.heading, { level: 5 }))
				break
			case NODES.HEADING_6:
				this.command(setBlockType(schema.nodes.heading, { level: 6 }))
				break
			default:
				this.command(setBlockType(schema.nodes[node]))
		}
	}

	command(cmd) {
		this.focus()
		cmd(this.view.state, this.view.dispatch, this.view)
	}

	is(type) {
		// return true if the nearest appropriate parent is of the supplied
	}
}