import { combineReducers } from 'redux'
import filters from './filters.js'
import items from './items.js'
import item from './item.js'

export { filters, items, item }

export default combineReducers({
  filters,
  items,
  item
})
