import Router from 'express/lib/router'
import { cars as Cars } from '../controllers'
import { cars } from './routes'
import { errorHandlerWrapper } from '../utils'

const router = new Router()

/**
 * @swagger
 * definitions:
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
 *   Reserve:
 *     type: object
 *     properties:
 *       reserve:
 *         type: boolean
 *   List:
 *     type: object
 *     properties:
 *       items:
 *         type: object
 *         additionalProperties:
 *           $ref: '#/definitions/Car'
 *       prev:
 *         type: string
 *       next:
 *         type: string
 *
 */

/**
 * @swagger
 * securityDefinitions:
 *   token:
 *     type: apiKey
 *     name: x-access-token
 *     in: header
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Car
 *     description: Get Car by ID
 *     operationId: all
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of Car
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Car'
 *       - name: x-requested-with
 *         in: header
 *         type: string
 *         default: XMLHttpRequest
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/Car'
 *     security:
 *       - token: []
 */
router.get(cars.get, errorHandlerWrapper(Cars.get))

/**
 * @swagger
 * /reserve/{id}:
 *   put:
 *     tags:
 *       - Car
 *     description: Reserve Car
 *     operationId: reserve
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
 *       - name: body
 *         description: Name and Locale for new translation
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Reserve'
 *       - name: x-requested-with
 *         in: header
 *         type: string
 *         default: XMLHttpRequest
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       401:
 *         description: 'not authorized'
 *       404:
 *         description: 'not found'
 *     security:
 *       - token: []
 */
router.put(cars.reserve, errorHandlerWrapper(Cars.reserve))

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Car
 *     description: Getting all cars
 *     operationId: getCars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: make
 *         in: path
 *         description: Make of car
 *         type: string
 *         required: false
 *       - name: model
 *         in: path
 *         description: Model of car
 *         type: string
 *         required: false
 *       - name: price
 *         in: query
 *         description: Max price of car
 *         type: integer
 *       - name: mileage
 *         in: query
 *         description: Max mileage of car
 *         type: integer
 *       - name: start
 *         in: query
 *         description: Pagination start
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Page limit
 *         type: integer
 *       - name: x-requested-with
 *         in: header
 *         type: string
 *         default: XMLHttpRequest
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/List'
 *       401:
 *         description: 'not authorized'
 *     security:
 *       - token: []
 */

/**
 * @swagger
 * /{make}:
 *   get:
 *     tags:
 *       - Car
 *     description: Getting all cars
 *     operationId: getCars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: make
 *         in: path
 *         description: Make of car
 *         type: string
 *         required: true
 *       - name: price
 *         in: query
 *         description: Max price of car
 *         type: integer
 *       - name: mileage
 *         in: query
 *         description: Max mileage of car
 *         type: integer
 *       - name: start
 *         in: query
 *         description: Pagination start
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Page limit
 *         type: integer
 *       - name: x-requested-with
 *         in: header
 *         type: string
 *         default: XMLHttpRequest
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/List'
 *       401:
 *         description: 'not authorized'
 *     security:
 *       - token: []
 */

/**
 * @swagger
 * /{make}/{model}:
 *   get:
 *     tags:
 *       - Car
 *     description: Getting all cars
 *     operationId: getCars
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: make
 *         in: path
 *         description: Make of car
 *         type: string
 *         required: true
 *       - name: model
 *         in: path
 *         description: Model of car
 *         type: string
 *         required: true
 *       - name: price
 *         in: query
 *         description: Max price of car
 *         type: integer
 *       - name: mileage
 *         in: query
 *         description: Max mileage of car
 *         type: integer
 *       - name: start
 *         in: query
 *         description: Pagination start
 *         type: integer
 *       - name: limit
 *         in: query
 *         description: Page limit
 *         type: integer
 *       - name: x-requested-with
 *         in: header
 *         type: string
 *         default: XMLHttpRequest
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/List'
 *       401:
 *         description: 'not authorized'
 *     security:
 *       - token: []
 */

router.get(cars.list, errorHandlerWrapper(Cars.list))

export default router
