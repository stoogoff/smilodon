
import { Schema } from 'prosemirror-model'

const schema = new Schema({
	nodes: {
		doc: {
			content: 'block+'
		},
		paragraph: {
			content: 'inline*',
			group: 'block',
			parseDOM: [{ tag: 'p' }],
			toDOM: () => ['p', 0],
		},
		blockquote: {
			content: 'block+',
			group: 'block',
			parseDOM: [{ tag: 'blockquote' }],
			toDOM: () => ['blockquote', 0],
		},
		horizontal_rule: {
			group: 'block',
			parseDOM: [{ tag: 'hr' }],
			toDOM:() => ['div', ['hr']],
		},
		heading: {
			attrs: { level: { default: 1 } },
			content: '(text | image)*',
			group: 'block',
			defining: true,
			parseDOM: [
				{ tag: 'h1', attrs: { level: 1 } },
				{ tag: 'h2', attrs: { level: 2 } },
				{ tag: 'h3', attrs: { level: 3 } },
				{ tag: 'h4', attrs: { level: 4 } },
				{ tag: 'h5', attrs: { level: 5 } },
				{ tag: 'h6', attrs: { level: 6 } },
			],
			toDOM : node => ['h' + node.attrs.level, 0],
		},
		code_block: {
			content: 'text*',
			group: 'block',
			code: true,
			defining: true,
			marks: '',
			attrs: { params: { default: '' } },
			parseDOM: [
				{
					tag: 'pre',
					preserveWhitespace: 'full',
					getAttrs: node => ({params: node.getAttribute('data-params') || ''}),
				},
			],
			toDOM: node => ['pre', node.attrs.params ? { 'data-params': node.attrs.params } : {}, ['code', 0]]
		},
		ordered_list: {
			content: 'list_item+',
			group: 'block',
			attrs: { order: { default: 1 }, tight: { default: false } },
			parseDOM: [
				{
					tag: 'ol',
					getAttrs: dom => ({
						order: dom.hasAttribute('start') ? parseInt(dom.getAttribute('start')) : 1,
						tight: dom.hasAttribute('data-tight')
					}),
				},
			],
			toDOM: node => ['ol', { start: node.attrs.order == 1 ? null : node.attrs.order, 'data-tight': node.attrs.tight ? 'true' : null }, 0]
		},
		bullet_list: {
			content: 'list_item+',
			group: 'block',
			attrs: { tight: { default: false } },
			parseDOM: [
				{
					tag: 'ul',
					getAttrs: dom => ({ tight: dom.hasAttribute('data-tight') })
				},
			],
			toDOM: node => ['ul', {'data-tight': node.attrs.tight ? 'true' : null}, 0],
		},
		list_item: {
			content: 'block+',
			defining: true,
			parseDOM: [{ tag: 'li' }],
			toDOM: () => ['li', 0],
		},
		text: {
			group: 'inline'
		},
		image: {
			inline: true,
			attrs: {
				src: {},
				alt: { default: null },
				title: { default: null },
			},
			group: 'inline',
			draggable: true,
			parseDOM: [
				{
					tag: 'img[src]',
					getAttrs: dom => ({
						src: dom.getAttribute('src'),
						title: dom.getAttribute('title'),
						alt: dom.getAttribute('alt'),
					}),
				},
			],
			toDOM: node => ['img', node.attrs],
		},
		hard_break: {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM: () => ['br'],
		},
	},
	marks: {
		em: {
			parseDOM: [
				{ tag: 'i' },
				{ tag: 'em' },
				{ style: 'font-style=italic' },
				{ style: 'font-style=normal', clearMark: m => m.type.name == 'em' },
			],
			toDOM: () => ['em'],
		},
		strong: {
			parseDOM: [
				{ tag: 'strong' },
				{ tag: 'b', getAttrs: node => node.style.fontWeight != 'normal' && null },
				{ style: 'font-weight=400', clearMark: m => m.type.name == 'strong' },
				{ style: 'font-weight', getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
			],
			toDOM: () => ['strong'],
		},
		link: {
			attrs: {
				href: {},
				title: { default: null },
			},
			parseDOM: [
				{
					tag: 'a[href]',
					getAttrs: dom => ({
						href: dom.getAttribute('href'),
						title: dom.getAttribute('title'),
					}),
				},
			],
			toDOM: node => ['a', node.attrs],
		},
		code: {
			parseDOM: [{ tag: 'code' }],
			toDOM: () => ['code'],
		},
	},
})

export default schema
