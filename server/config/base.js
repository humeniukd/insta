/* eslint camelcase: 0 */
const port = 56780
const client_secret = 'ntY4juSYvRrwbxmpjGqHf4-H'
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
const tokenUrl = 'https://www.googleapis.com/oauth2/v4/token'
const client_id = '304014048213-ovo201esthvp8mdga35i85dmcjt5ehiv.apps.googleusercontent.com'
const callbackUrl = '/oauth2callback'
const staticRegexp = /\.([0-9a-z]+)(?:[?#]|$)/i
const scope = 'email%20profile'

const config = {
  port,
  authUrl,
  tokenUrl,
  client_secret,
  scope,
  client_id,
  callbackUrl,
  staticRegexp
}

export default config
