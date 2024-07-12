
import { marked } from 'marked'

export const markdown = content => marked(content || '', { smartypants: true })
