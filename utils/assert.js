
export const notNull = value => value !== undefined && value !== null

export const isNull = value => value === undefined || value  === null

export const notEmptyString = value => notNull(value) && value !== ''

export const isEmptyString = value => isNull(value) || value === ''

export const notArray = value => notNull(value) && value.length !== 0
