
import { marked } from 'marked'

export const markdown = content => marked(content || '', { smartypants: true })

export const isVagueUrl = input => hasProtocol(input) || input.match(/\.[^.]+$/)

export const hasProtocol = input =>
	input.startsWith('http://') || input.startsWith('https://') 
