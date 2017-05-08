import uuid from 'uuid'
import { makes, models } from '../../common'
const data = {}

const maxMileage = 300000
const maxPrice = 30000
const itemsCount = 10000

const imgs = {
  A3: (n) => `https://cdn-carpics.instamotion.com/WAUZZZ8V4E1040274/gallery/image_0${n}.jpg`,
  A4: (n) => `https://cdn-carpics.instamotion.com/WAUZZZ8K6EA075274/gallery/image_0${n}.jpg`,
  A5: (n) => `https://cdn-carpics.instamotion.com/WAUZZZ8T0GA012845/gallery/image_0${n}.jpg`,
  'Series 3': (n) => `https://cdn-carpics.instamotion.com/WBA3Z91050D367116/gallery/image_0${n}.jpg`,
  X3: (n) => `https://cdn-carpics.instamotion.com/WBAWZ510700M24445/gallery/image_0${n}.jpg`,
  M3: (n) => `https://cdn-carpics.instamotion.com/WBS8M910505D80493/gallery/image_0${n}.jpg`,
  Corsa: (n) => `https://cdn-carpics.instamotion.com/W0L0XEP08G6081741/gallery/image_0${n}.jpg`,
  Meriva: (n) => `https://cdn-carpics.instamotion.com/W0LSD9EN6G4205667/gallery/image_0${n}.jpg`,
  Insignia: (n) => `https://cdn-carpics.instamotion.com/W0LGT6E19G1007333/gallery/image_0${n}.jpg`

}

const rnd = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min
let i = 0
while (i++ < itemsCount) {
  const id = uuid()
  const make = makes[rnd(makes.length)]
  const makeModels = models[make]
  const model = makeModels[rnd(makeModels.length)]
  const img = imgs[model](rnd(4, 1))
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

export default (criteria, options) => {
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
    .slice(start, start + limit)
}
