import {
  INVALIDATE, RECEIVE_ITEMS, RECEIVE_ERROR
} from '../actions/items'

// const selectedFilter = (state = '', action) => {
//   switch (action.type) {
//     case SELECT:
//       const { make, model } = action.filter
//       return [ make, model ].filter(Boolean).join('/')
//     default:
//       return state
//   }
// }

const setReceivedAt = (items, receivedAt) => Object.keys(items).reduce((acc, id) => ({
  ...acc,
  [id]: {
    ...items[id],
    receivedAt
  }
}), {})

export default (state = { }, action) => {
  const { type, items, id, receivedAt, error } = action
  switch (type) {
    case INVALIDATE:
      state = {...state}
      delete state[id]
      return state
    case RECEIVE_ERROR:
      return {
        ...state,
        error
      }
    case RECEIVE_ITEMS:
      return {
        ...state,
        ...setReceivedAt(items, receivedAt)
      }
    default:
      return state
  }
}
