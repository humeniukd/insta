import fetch from 'isomorphic-fetch'
import { credentials } from './'
export const REQUEST_ITEM = 'REQUEST_ITEM'
export const RECEIVE_ITEM = 'RECEIVE_ITEM'
export const RECEIVE_ERROR = 'RECEIVED_ERROR'
export const SELECT = 'SELECT'
export const INVALIDATE_ITEM = 'INVALIDATE_ITEM'

export const invalidate = ({id}) => ({
  type: INVALIDATE_ITEM,
  id
})

export const requestItem = id => ({
  type: REQUEST_ITEM,
  isFetching: true,
  id
})

export const receiveItem = item => ({
  type: RECEIVE_ITEM,
  item,
  receivedAt: Date.now()
})

export const receiveError = item => ({
  type: RECEIVE_ITEM,
  item,
  receivedAt: Date.now()
})

const fetchItem = id => async dispatch => {
  const url = `/api/${id}`
  dispatch(requestItem(id))
  try {
    const response = await fetch(url, {credentials})
    const json = await response.json()
    dispatch(receiveItem(json))
  } catch (e) {
    dispatch(receiveItem(e))
  }
}

export const reserveItem = id => async dispatch => {
  const url = `/api/reserve/${id}`
  const options = {
    credentials,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reserved: true })
  }
  dispatch(requestItem(id))
  try {
    const response = await fetch(url, options)
    const json = await response.json()
    dispatch(invalidate(json))
  } catch (e) {
    dispatch(receiveItem(e))
  }
}

const shouldFetch = (state, id) => {
  const data = state.items[id]
  if (!data) {
    return true
  }
  if (data.isFetching) {
    return false
  }
  return data.didInvalidate
}

export const fetchItemIfNeeded = filter => (dispatch, getState) => {
  if (shouldFetch(getState(), filter)) {
    return dispatch(fetchItem(filter))
  }
}
