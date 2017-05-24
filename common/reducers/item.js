import { item } from '../actions'

const {
  RECEIVE_ITEM,
  SELECT,
  REQUEST_ITEM,
  RECEIVE_ERROR, INVALIDATE_ITEM } = item

export default (state = { }, action) => {
  const { type, item, id, error, receivedAt } = action
  switch (type) {
    case INVALIDATE_ITEM:
      state = {...state}
      delete state[id]
      return state
    case REQUEST_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { id, isFetching: true }
        }
      }
    case RECEIVE_ERROR:
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { id, error, isFetching: false }
        }
      }
    case RECEIVE_ITEM:
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: { ...item, receivedAt }
        }
      }
    default:
      return state
  }
}
