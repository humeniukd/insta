import process from 'process'

const config = require(`./${process.env.NODE_ENV || 'development'}`)

export default config.default
