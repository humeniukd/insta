import base from './base'
import development from './development'
import production from './production'

export default { development, production, test: base }[ process.env.NODE_ENV || 'development' ]
