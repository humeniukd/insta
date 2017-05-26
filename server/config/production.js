import base from './base'

const port = process.env.PORT || 80

const config = { ...base, port }

export default config
