import Vue from 'vue'
import { localeDate, localeDatetime } from '~/utils/date'

Vue.filter('date', localeDate)
Vue.filter('datetime', localeDatetime)
