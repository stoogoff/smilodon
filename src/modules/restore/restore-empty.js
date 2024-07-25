
import { element } from '~/modules/db/element'
import RestoreNew from './restore-new'

export default class RestoreEmpty extends RestoreNew  {
	// override saveElement to create a new element
	_saveElement(elm) {
		return element().create(elm)
	}

	// override prepare to remove the objects _id
	_prepare(obj, projectId) {
		delete obj._id

		return super._prepare(obj, projectId)
	}
}
