
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
	schema,
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import { toggleMark, setBlockType, wrapIn, lift } from'prosemirror-commands'
import { exampleSetup } from 'prosemirror-example-setup'
import { MARKS, NODES, EVENTS } from './config'
import Emitter from './emitter'

const createState = content => EditorState.create({
	doc: defaultMarkdownParser.parse(content),
	plugins: exampleSetup({ schema, menuBar: false }),
})

export default class MarkdownEditor extends Emitter {
	constructor(node) {
		super()

		this.view = new EditorView(node, {
			state: createState(''),
			dispatchTransaction: tx => {
				const newState = this.view.state.apply(tx)

				this.view.updateState(newState)

				this.emit(EVENTS.CONTENT, this.content)
				this.emit(EVENTS.STATE, newState)
			},
		})
	}

	get content() {
		return defaultMarkdownSerializer.serialize(this.view.state.doc)
	}

	set content(content) {
		this.view.updateState(createState(content))
	}

	get state() {
		return this.view.state
	}

	get selection() {
		return this.view.state.selection
	}

	selectedMarks() {
		const selection = this.selection
		let marks = []

		if(selection.empty) {
			marks = selection.$from.marks().map(m => m.type.name)
		}
		else {
			const set = new Set()

			selection.$head.marks().forEach(m => set.add(m.type.name))
			selection.$anchor.marks().forEach(m => set.add(m.type.name))

			marks = Array.from(set)
		}

		const result = {
			[MARKS.EM]: false,
			[MARKS.STRONG]: false,
			[MARKS.CODE]: false,
			[MARKS.LINK]: false,
		}

		for(let i = 0, len = marks.length; i < len; ++i) {
			result[marks[i]] = true
		}

		return result
	}

	selectedNode() {
		const selection = this.selection
		let depth = selection.$anchor.depth

		const result = {
			[NODES.BLOCKQUOTE]: false,
			[NODES.LIST_BULLET]: false,
			[NODES.LIST_ORDERED]: false,
		}

		do {
			const node = selection.$anchor.node(depth)

			if(node.type.name === NODES.BLOCKQUOTE) {
					result[NODES.BLOCKQUOTE] = true
					break
			}

			if(node.type.name === NODES.LIST_BULLET) {
					result[NODES.LIST_BULLET] = true
					break
			}

			if(node.type.name === NODES.LIST_ORDERED) {
					result[NODES.LIST_ORDERED] = true
					break
			}

		} while(depth-- > 0)

		return result
	}

	focus() {
		this.view.focus()
	}

	destroy() {
		this.view.destroy()
	}

	toggle(mark, attrs) {
		return this.command(toggleMark(schema.marks[mark], attrs))
	}

	wrap(node) {
		const nodes = this.selectedNode()

		if(nodes[node]) {
			this.focus()
			return lift(this.view.state, this.view.dispatch)
		}
		else {
			return this.command(wrapIn(schema.nodes[node]))
		}
	}

	block(node) {
		switch(node) {
			case NODES.HEADING_1:
				return this.command(setBlockType(schema.nodes.heading, { level: 1 }))
			case NODES.HEADING_2:
				return this.command(setBlockType(schema.nodes.heading, { level: 2 }))
			case NODES.HEADING_3:
				return this.command(setBlockType(schema.nodes.heading, { level: 3 }))
			case NODES.HEADING_4:
				return this.command(setBlockType(schema.nodes.heading, { level: 4 }))
			case NODES.HEADING_5:
				return this.command(setBlockType(schema.nodes.heading, { level: 5 }))
			case NODES.HEADING_6:
				return this.command(setBlockType(schema.nodes.heading, { level: 6 }))
			default:
				return this.command(setBlockType(schema.nodes[node]))
		}
	}

	command(cmd) {
		this.focus()
		return cmd(this.view.state, this.view.dispatch, this.view)
	}
}
