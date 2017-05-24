import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setMetadata } from '../../common/reducers/filters'
import { RECEIVE_ITEMS } from '../../common/actions/items'

import configureStore from '../../common/store'
import { App } from '../../common/containers'

export default (fn) => async (req, res) => {
  const filter = req.url

  global.navigator = {
    userAgent: req.headers['user-agent']
  }
  const data = await fn(req, res)
  const receivedAt = Date.now()
  const { items } = data

  const store = items ? configureStore({
    filters: {
      [filter]: setMetadata({}, {
        ...data,
        type: RECEIVE_ITEMS,
        receivedAt,
        ids: Object.keys(items)
      })
    },
    items
  }) : configureStore({
    items: { [data.id]: { ...data, receivedAt } }
  })

  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        <App/>
      </StaticRouter>
    </Provider>)
  return renderFullPage(html, store.getState())
}

const renderFullPage = (html, preloadedState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Insta Car</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1,
          minimum-scale=1">
        <style>
          @import url(//fonts.googleapis.com/css?family=Roboto);
          html {
            font-family: 'Roboto', sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
          window.process = ${JSON.stringify({env: {NODE_ENV: process.env.NODE_ENV}})}
        </script>
        <script src="/vendor.js"></script>
        <script src="/main.js"></script>
      </body>
    </html>
    `
}
