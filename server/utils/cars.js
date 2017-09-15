import uuid from 'uuid'
import { makes, models } from '../../common'
import { NotFoundError } from './errors'

const data = {}

const maxMileage = 300000
const maxPrice = 30000
const itemsCount = 10000

const genImg = (make, model, n) => `img/${make}/${model}/${n}.jpg`

const rnd = n => Math.floor(Math.random() * n)
let i = 0
while (i++ < itemsCount) {
  const id = uuid()
  const make = makes[rnd(makes.length)]
  const modelsOfMake = models[make]
  const model = modelsOfMake[rnd(modelsOfMake.length)]
  const img = genImg(make, model, rnd(9))
  const mileage = rnd(maxMileage)
  const price = rnd(maxPrice)
  data[id] = {
    id,
    make,
    img,
    model,
    mileage,
    price,
    reserved: false
  }
}

export const paramsToPath = (params) => {
  const { model, make } = params
  return [model, make].filter(Boolean).join('/')
}

export const list = async (criteria, options = {}) => {
  const items = Object.values(data)
  const { make, model, mileage, price } = criteria
  const { start = 0, limit = 10, sort = {price: 1} } = options
  const sortBy = Object.keys(sort)[0]
  const sortOrder = parseInt(sort[sortBy])

  const conditions = [(item) => !item.reserved]

  make && conditions.push((item) => item.make === make)
  model && conditions.push((item) => item.model === model)
  mileage && conditions.push((item) => item.mileage <= mileage)
  price && conditions.push((item) => item.price <= price)

  return items.filter(item => conditions.every(fn => fn(item)))
    .sort((a, b) => sortOrder ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy])
    .slice(start, start + limit).reduce((res, item) => ({ ...res, [item.id]: item }), {})
}

const notFound = () => { throw new NotFoundError() }

export const get = async id => data[id] || notFound()

export default {
  list,
  get
}
