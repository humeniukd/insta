import Router from 'express/lib/router'
import { cars as Cars } from '../controllers'
import { cars } from './routes'
import { errorHandlerWrapper } from '../utils'

const router = new Router()

/**
 * @swagger
 * definition:
 *   Car:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       model:
 *         type: string
 *       make:
 *         type: string
 *       mileage:
 *         type: integer
 *       img:
 *         type: string
 *       price:
 *         type: integer
 *       reserved:
 *         type: boolean
 */

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     tags:
 *       - Car
 *     description: Get Car by ID
 *     operationId: all
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of Car
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Car'
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/Car'
 */
router.get(cars.get, errorHandlerWrapper(Cars.get))

/**
 * @swagger
 * /cars/{id}:
 *   post:
 *     tags:
 *       - Car
 *     description: Delete Car
 *     operationId: delete
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of category model
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 'successful operation'
 */
router.post(cars.reserve, errorHandlerWrapper(Cars.reserve))

/**
 * @swagger
 * /cars:
 *   get:
 *     tags:
 *       - Car
 *     description: Getting all cars
 *     operationId: getCars
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skip
 *         in: query
 *         description: Amount of skip result
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Limit of result
 *         type: integer
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Car'
 */
router.get(cars.list, errorHandlerWrapper(Cars.list))

export default router
