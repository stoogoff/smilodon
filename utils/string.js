
import { marked } from 'marked'

export const markdown = content => marked(content || '', { smartypants: true })

export const slugify = text => text.toLowerCase().trim().replace(/\s+/g, '-')

export const toTitleCase = text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()

export const normalise = text => 
	text.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()

export const search = (input, text) => normalise(input).indexOf(normalise(text)) !== -1

export const searchObject = (input, text) => Object.values(input).some(value => search(value, text))
