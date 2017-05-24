import fetch from 'isomorphic-fetch'
export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const RECEIVE_ERROR = 'RECEIVE_ERROR'
export const SELECT = 'SELECT'
export const INVALIDATE = 'INVALIDATE'

export const invalidate = id => ({
  type: INVALIDATE,
  id
})

export const requestItems = filter => ({
  type: REQUEST_ITEMS,
  filter
})

export const receiveItems = (filter, {items, prev, next}) => ({
  type: RECEIVE_ITEMS,
  filter,
  ids: Object.keys(items),
  items,
  prev,
  next,
  receivedAt: Date.now()
})

export const receiveError = (filter, error) => ({
  type: RECEIVE_ERROR,
  filter,
  error,
  receivedAt: Date.now()
})

const fetchItems = filter => async dispatch => {
  const url = `/api${filter}`
  dispatch(requestItems(filter))
  try {
    const response = await fetch(url)
    const json = await response.json()
    dispatch(receiveItems(filter, json))
  } catch (e) {
    dispatch(receiveError(filter, e))
  }
}

const shouldFetch = (state, filter) => {
  const data = state.filters[filter]
  if (!data) {
    return true
  }
  if (data.isFetching) {
    console.log('isFetching')
    return false
  }
  return data.didInvalidate
}

export const fetchItemsIfNeeded = filter => (dispatch, getState) => {
  if (shouldFetch(getState(), filter)) {
    return dispatch(fetchItems(filter))
  }
}
