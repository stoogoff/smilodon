
import { getIcon } from '~/utils/icons'

export const section = (id, label, icon) => ({
	id,
	label,
	image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(getIcon(icon)),
	shape: 'image',
	size: 12,
	color: 'white',
	font: { size: 14, color: '#555' },
})

export const link = (from, to) => ({
	from,
	to,
})

export const root = (id, label) => ({
	id,
	label,
	shape: 'box',
	color: { background: '#bbb', border: 'black' },
	margin: 8,
	font: { size: 16, color: '#222' },
	x: 250,
	y: 250,
})

export const element = (id, label) => ({
	id,
	label,
	shape: 'box',
	color: { background: '#ddd', border: '#bbb' },
	margin: 6,
	font: { size: 14, color: '#333' },
})
