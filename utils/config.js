
// default data types
export const DEFAULT_ENTITY = {
	title: '',
	description: '',
	properties: {},
	tags: [],
	category: '',
}

export const DEFAULT_PROPERTY = {
	value: '',
	type: '',
}

export const DEFAULT_CATEGORY = {
	title: '',
	parent: '',
}

export const PROPERTY_TYPES = [
	'Text',
	'Number',
	'Date',
	'DateTime',
	'Time',
	'True/False',
]

// default ids
export const ENTITY_ID_PREFIX = 'entity:'
export const PROPERTY_ID_PREFIX = 'property:'
export const CATEGORY_ID_PREFIX = 'category:'

// global events
export const ENTITIES_UPDATED = 'entities-updated'

