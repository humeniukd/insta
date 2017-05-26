import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from '../common/store'
import { App } from '../common/containers'

const store = configureStore(window.__PRELOADED_STATE__)

render(
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>,
  document.getElementById('root')
)
