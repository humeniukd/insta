import { item, items } from '../actions'

const { SELECT, INVALIDATE,
  REQUEST_ITEMS, RECEIVE_ITEMS } = items
const { INVALIDATE_ITEM } = item

// const selectedFilter = (state = '', action) => {
//   switch (action.type) {
//     case SELECT:
//       const { make, model } = action.filter
//       return [ make, model ].filter(Boolean).join('/')
//     default:
//       return state
//   }
// }

export const setMetadata = (state = {
  isFetching: false,
  didInvalidate: false,
  ids: []
}, action) => {
  const { type, ids, prev, next, receivedAt } = action
  switch (type) {
    case INVALIDATE:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_ITEMS:
      return {
        ...state,
        ids: [],
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_ITEMS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        ids,
        next,
        prev,
        receivedAt
      }
    default:
      return state
  }
}

const getNexts = (state, filter, acc = []) => {
  acc = [ ...acc, filter ]
  const { next } = state[filter] || {}
  console.log('getNexts', state, next, acc)
  return next ? getNexts(state, next, acc) : acc
}

const getFiltersWithId = (state, id) => Object.keys(state).filter(filter => {
  const { ids = [] } = state[filter]
  return ids.includes(id)
})

const deleteMany = (state, keys) => {
  state = { ...state }
  keys.forEach(key => delete state[key])
  return state
}

export default (state = { }, action) => {
  const { type, filter } = action
  switch (type) {
    case INVALIDATE_ITEM:
      const filters = getFiltersWithId(state, action.id)
      const filtersToWipe = filters.reduce((acc, filter) => [ ...acc, ...getNexts(state, filter) ], [])
      return deleteMany(state, filtersToWipe)
    case RECEIVE_ITEMS:
    case REQUEST_ITEMS:
      return {
        ...state,
        [filter]: setMetadata(state[filter], action)
      }
    default:
      return state
  }
}
