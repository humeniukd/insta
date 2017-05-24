import { fourHundredFour } from '../utils'
import Router from 'express/lib/router'
import CarsRouter from './cars'
import RenderRouter from './render'

let router = new Router()

router.use('/api', CarsRouter)

router.get('*', RenderRouter)

export default router
