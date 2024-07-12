
import { notNull, notEmptyString } from 'vue-daisy-ui/utils/assert'
import { ELEMENT_ID_PREFIX, CATEGORY_ID_PREFIX, PROJECT_ID_PREFIX } from '~/utils/config'

// project specific asserts

export const isElement = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(ELEMENT_ID_PREFIX)
export const isCategory = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(CATEGORY_ID_PREFIX)
export const isProject = value => notNull(value) &&  notEmptyString(value._id) && value._id.startsWith(PROJECT_ID_PREFIX)
