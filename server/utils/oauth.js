/* eslint camelcase: 0 */
import config from '../config'
import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'
import users from './users'
import uuid from 'uuid'

export default () => {
  return async (req, res, next) => {
    const {
      client_id,
      resource = req.protocol + '://' + req.get('host'),
      callbackUrl,
      client_secret,
      redirect_uri = `${resource}${callbackUrl}`,
      sessionIdCookieName = 'x-access-token',
      scope,
      authUrl,
      tokenUrl,
      grant_type = 'authorization_code',
      response_type = 'code',
      staticRegexp
    } = config

    const isStatic = (url) => staticRegexp.test(url)

    async function retrieveSessionId (req) {
      const { url, query, cookies } = req
      const sessionId = cookies[sessionIdCookieName]
      if (users.has(sessionId)) {
        req.user = users.get(sessionId)
        return
      } else if (!url.includes(callbackUrl)) {
        throw Error
      }
      const headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      const params = {
        code: query.code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type
      }

      const body = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&')

      const options = {
        method: 'POST',
        headers,
        body
      }
      const resp = await fetch(tokenUrl, options)
      const { error, id_token, expires_in, access_token } = await resp.json()
      if (error || !access_token) {
        throw error
      }
      const { name, email } = jwt.decode(id_token)
      const id = uuid()
      const expires = new Date(Date.now() + expires_in * 1000)
      users.set(id, { id, name, email, expires, access_token })
      res.cookie(sessionIdCookieName, id, { expires })
      res.redirect('/')
    }

    const authParams = {
      client_id,
      redirect_uri,
      response_type,
      scope
    }

    const authQuery = Object.keys(authParams).map((key) => `${key}=${authParams[key]}`).join('&')
    const authFullUrl = `${authUrl}?${authQuery}`

    if (isStatic(req.url)) {
      next()
    } else {
      try {
        await retrieveSessionId(req)
        next()
      } catch (err) {
        if (req.xhr) {
          res.writeHead(401)
        } else {
          res.writeHead(302, { Location: authFullUrl })
        }
        res.end()
      }
    }
  }
}
