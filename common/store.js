import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'

const configureStore = (preloadedState = {}) => {
  const middleware = [ thunk ]
  if (process.env.NODE_ENV !== 'production' && !(process && process.versions && process.versions.node)) {
    middleware.push(createLogger())
  }

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middleware)
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
