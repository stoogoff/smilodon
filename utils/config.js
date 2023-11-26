
// top nav menu items
export const  MENU_ITEMS = [
	{ title: 'Home', href: '/' },
	{ title: 'Categories', href: '/categories' },
	{ title: 'Entities', href: '/entities' },
]

// editor toolbar
export const EDITOR_TOOLBAR = [
	[{ 'header': [false, 1, 2, 3, 4, 5, 6 ] }],
	['bold', 'italic', 'underline', 'strike'],
	['blockquote', 'code-block'],
	[{ list: 'ordered' }, { list: 'bullet' }],
	[{ indent: '-1' }, { indent: '+1' }],
	[{ 'script': 'sub'}, { 'script': 'super' }],  
	['link']
]

// default data types
export const DEFAULT_ENTITY = {
	title: '',
	project: '',
	description: '',
	properties: [],
	tags: [],
	category: '',
	icon: '',
}

export const DEFAULT_PROPERTY = {
	name: '',
	value: '',
	type: '',
}

export const DEFAULT_CATEGORY = {
	project: '',
	title: '',
	parent: '',
}

export const DEFAULT_PROJECT = {
	title: '',
	description: '',
}

export const PROPERTY_TYPES = [
	'Text',
	'Number',
	'Date',
	'DateTime',
	'Time',
	'True/False',
	// this will either need to be a URL to an external service or base64 encoded
	// it'll eat up browser space if it's stored locally
	'Image',
]

// default ids
export const ENTITY_ID_PREFIX = 'entity:'
export const PROPERTY_ID_PREFIX = 'property:'
export const CATEGORY_ID_PREFIX = 'category:'
export const PROJECT_ID_PREFIX = 'project:'

// global events
export const ENTITIES_UPDATED = 'entities-updated'
export const CATEGORIES_UPDATED = 'categories-updated'
export const PROJECTS_UPDATED = 'projects-updated'
