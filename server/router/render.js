import Router from 'express/lib/router'
import { cars as Cars } from '../controllers'
import { cars } from './routes'
import { errorHandlerWrapper, renderWrapper } from '../utils'

const router = new Router()

router.get(cars.get, errorHandlerWrapper(renderWrapper((req, res) => Cars.get(req, res))))
router.get(cars.list, errorHandlerWrapper(renderWrapper((req, res) => Cars.list(req, res))))

export default router
