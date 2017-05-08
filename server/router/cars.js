import Router from 'express/lib/router'
import { CarsController } from '../controllers/cars'
import { cars } from './routes'
import { errorHandlerWrapper } from '../utils'

const router = new Router()

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Category
 *     description: Getting all Category
 *     operationId: getCategory
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
 *       - name: name
 *         in: query
 *         description: Category name
 *         type: string
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Category'
 */
router.get(cars.list, errorHandlerWrapper(CarsController.list))

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Category
 *     description: Get Category by ID
 *     operationId: all
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of Category
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Category'
 *     responses:
 *       200:
 *         description: 'successful operation'
 *         schema:
 *           $ref: '#/definitions/Category'
 */
router.get(cars.get, errorHandlerWrapper(CarsController.get))

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     description: Delete Category
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
router.delete(cars.reserve, errorHandlerWrapper(CarsController.reserve))

export default router
