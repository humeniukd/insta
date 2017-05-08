import { cars } from '../utils'

const buildCriteria = ({make, model, price, mileage}) => {
  return {
    make,
    model,
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

const list = async (req, res) => {
  const query = req.query || {}
  const criteria = buildCriteria(query)
  const options = buildOptions(query)
  const items = cars(criteria, options)

  return res.send(items)
}

const get = async (req, res) => {
  const carId = req.params.id
  const car = await cars.findById(carId)

  return res.send(car)
}

const reserve = async (req, res) => {
  const carId = req.params.id
  const car = await cars.findById(carId)
  await car.remove()

  return res.status(201).send(car)
}

export const CarsController = {
  list,
  get,
  reserve
}
