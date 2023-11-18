
import { DEFAULT_ENTITY, ENTITY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => new Access(db, ENTITY_ID_PREFIX, DEFAULT_ENTITY)
