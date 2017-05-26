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
      sessionIdKey,
      scope,
      authUrl,
      tokenUrl,
      grant_type = 'authorization_code',
      response_type = 'code',
      staticRegexp
    } = config

    const isStatic = (url) => staticRegexp.test(url)
    const preparePrams = (params) => Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')

    const retrieveSessionId = async (req) => {
      const { url, query, cookies, headers } = req
      const sessionId = cookies[sessionIdKey] || headers[sessionIdKey]
      if (users.has(sessionId)) {
        req.user = users.get(sessionId)
        return
      } else if (!url.includes(callbackUrl)) {
        throw Error
      }
      await fetchUser(query.code)
    }

    const fetchUser = async (code) => {
      const headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      const params = {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type
      }

      const body = preparePrams(params)

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
      const user = { id, name, email, expires, access_token }
      users.set(id, user)
      res.cookie(sessionIdKey, id, { expires })
      res.redirect('/')
    }

    const authParams = {
      client_id,
      redirect_uri,
      response_type,
      scope
    }

    const authQuery = preparePrams(authParams)
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
