
import { DEFAULT_CATEGORY, CATEGORY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => new Access(db, CATEGORY_ID_PREFIX, DEFAULT_CATEGORY)
