
// default data types
export const DEFAULT_ELEMENT = {
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
	type: 'Text',
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
	'Image URL',
]

// default ids
export const ELEMENT_ID_PREFIX = 'element:'
export const PROPERTY_ID_PREFIX = 'property:'
export const CATEGORY_ID_PREFIX = 'category:'
export const PROJECT_ID_PREFIX = 'project:'

// global events
export const ELEMENTS_UPDATED = 'elements-updated'
export const CATEGORIES_UPDATED = 'categories-updated'
export const PROJECTS_UPDATED = 'projects-updated'
export const SHOW_MESSAGE = 'show-message'

// storage keys
export const TREE_STATE = 'tree-state'
export const TREE_STATE_PROJECT = 'tree-state-project'
export const DEFAULT_ELEMENT_ID = 'new-element'
export const THEME = 'theme'

// project file name for backup
export const PROJECT_FILE_NAME = '_project.md'
