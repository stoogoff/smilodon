
// project specific asserts

import { ENTITY_ID_PREFIX, CATEGORY_ID_PREFIX, PROJECT_ID_PREFIX } from '~/utils/config'

export const isEntity = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(ENTITY_ID_PREFIX)
export const isCategory = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(CATEGORY_ID_PREFIX)
export const isProject = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(PROJECT_ID_PREFIX)

// generic asserts

export const notNull = value => value !== undefined && value !== null

export const isNull = value => value === undefined || value  === null

export const throwIfNull = (value, name) => {
	if(isNull(value))
		throw new Error(`Null or undefined value found for '${name}'`)
}

export const notIn = (property, obj) => !(property in obj)

export const isIn = (property, obj) => property in obj

export const notEmptyString = value => notNull(value) && value !== ''

export const isEmptyString = value => isNull(value) || value === ''

export const notArray = value => notNull(value) && value.length !== 0
