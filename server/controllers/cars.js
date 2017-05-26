import { cars, mailer as send } from '../utils'
import { format, parse } from 'url'

const buildCriteria = ({price, mileage}, defaults = {}) => {
  return {
    ...defaults,
    price: parseInt(price),
    mileage: parseInt(mileage)
  }
}
const buildOptions = ({start = 0, limit = 10, sort = {price: 1}}) => {
  return {
    start: parseInt(start),
    limit: parseInt(limit),
    sort
  }
}

const list = async (req) => {
  const { params = {}, query = {}, url } = req
  const criteria = buildCriteria(query, params)
  const options = buildOptions(query)
  const { start, limit } = options
  const { pathname } = parse(url)

  const items = await cars.list(criteria, options)
  const q = query => format({ pathname, query, search: null })
  let next, prev
  if (Object.keys(items).length === limit) {
    next = q({ ...query, start: start + limit })
  }
  if (start >= limit) {
    prev = start > limit ? q({ ...query, start: start - limit }) : delete query.start && q(query)
  }
  return { items, next, prev }
}

const get = async (req) => {
  const id = req.params.id
  const car = await cars.get(id)
  return car
}

const reserve = async (req) => {
  const id = req.params.id
  const car = await cars.get(id)
  car.reserved = Boolean(req.body.reserved)
  try {
    await send(car, req.user)
  } catch (err) {
    console.log(err)
  }
  return { id }
}

export default {
  list,
  get,
  reserve
}
