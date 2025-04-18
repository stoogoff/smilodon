
import Vue from 'vue'
import PaperVueify from 'paper-vueify'
import paper from 'paper'

console.log('PaperVueify', PaperVueify)
console.log('paper', paper)

// the install process register 3 components into the global scope, p-canvas, p-item and p-symbol-definition
// the secondary parameter paper is to register your paper variable in current scope, or there will be two seperated PaperScope and the p-canvas will not work properly.
Vue.use(PaperVueify, paper.PaperScope)
