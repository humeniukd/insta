import { combineReducers } from 'redux'
import filters from './filters'
import items from './items'
import item from './item'

export { filters, items, item }

export default combineReducers({
  filters,
  items,
  item
})
