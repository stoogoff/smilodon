
import { local } from 'vue-daisy-ui/utils/storage'

export default {
	storeDiff(id, obj) {
		local.set(id, obj)
	},

	getDiff(id) {
		return local.get(id)
	},

	hasDiff(id) {
		return local.has(id)
	},

	removeDiff(id) {
		local.remove(id)
	},
}