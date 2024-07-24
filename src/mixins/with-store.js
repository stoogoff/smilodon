
import { notNull } from 'vue-daisy-ui/utils/assert'
import Diff from '~/modules/diff'

export default {
	data() {
		return {
			timer: null,
			interval: 5000,
			lastSaved: '',
		}
	},

	beforeDestroy() {
		this.stopSave()
	},

	methods: {
		// save an object to local storage with the specified properties for the supplied key
		// once this called saving will occur every `interval` milliseconds
		startSave(id, properties) {
			this.lastSaved = JSON.stringify(this._createObject(properties))

			this.timer = window.setInterval(() => {
				const obj = this._createObject(properties)
				const hash = JSON.stringify(obj)

				if(this.lastSaved != hash) {
					Diff.storeDiff(id, obj)
					this.lastSaved = hash
				}
			}, this.interval)
		},

		// create the object for saving
		_createObject(properties) {
			const obj = {}

			properties.forEach(key => obj[key] = this[key])

			return obj
		},

		// stop saving
		// called automatically when the component is destroyed
		stopSave() {
			if(notNull(this.timer)) {
				window.clearInterval(this.timer)
			}
		},

		// clear the data
		clearData(id) {
			this.stopSave()
			Diff.removeDiff(id)
		},
	},
}
