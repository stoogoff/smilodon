
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import { toggleMark, setBlockType, wrapIn, lift } from'prosemirror-commands'
import { exampleSetup } from 'prosemirror-example-setup'
import { MARKS, NODES, EVENTS } from './config'
import Emitter from './emitter'
import schema from './schema'

const createState = content => EditorState.create({
	doc: defaultMarkdownParser.parse(content),
	plugins: exampleSetup({ schema, menuBar: false }),
})

console.log(schema)

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

		// $head and $anchor behave slightly differently for links
		// compared to other marks (e.g. strong, em)
		// if a word is bolded (e.g. *bold*) the cursor point before the b doesn't have a mark
		// but the cursor point after the d does
		// if a word is linked (e.g. [link]) the cursor point before the l doesn't have a mark
		// and nor does the cursor point after the k
		// so selecting whole word which is the sole bold range will register as bolded in the editor
		// but selecting a whole word which is the sole linked range won't
		console.log('$head', selection.$head.marks().map(m => m.type.name))
		console.log('$anchor', selection.$anchor.marks().map(m => m.type.name))
		console.log('marks', marks)

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
		this.command(toggleMark(schema.marks[mark], attrs))
	}

	wrap(node) {
		const nodes = this.selectedNode()

		if(nodes[node]) {
			this.focus()
			lift(this.view.state, this.view.dispatch)
		}
		else {
			this.command(wrapIn(schema.nodes[node]))
		}
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
}
