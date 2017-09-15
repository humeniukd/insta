/* eslint camelcase: 0 */
import base from './base'

const port = process.env.PORT || 80
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const user = process.env.EMAIL
const pass = process.env.PASSWORD
const smtp = {
  service: 'Gmail',
  auth: {
    user,
    pass
  }
};

const config = { ...base, port, smtp, client_id, client_secret }

export default config
