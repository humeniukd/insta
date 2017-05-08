import CategoryCtrl from './cars'
import { NotFoundError } from '../utils/errors'

describe('Controller: Categories', () => {
  let category, spies, user

  beforeEach(() => {
    user = {
      _id: new ObjectId().toString(),
      role: 'admin'
    }
  })

  beforeEach((done) => {
    let categoryToBeCreated = {
      name: 'category',
      description: 'category description'
    }

    Category.create(categoryToBeCreated).then((createdCategory) => {
      category = createdCategory
      done()
    })
    .catch(console.error)
  })

  beforeEach(() => {
    spies = []
  })

  afterEach(() => {
    spies.map((spy) => {
      spy.restore()
    })
  })

  describe('#create()', () => {
    it('calls Category.create', () => {
      spies.push(sinon.stub(Category, 'create', () => {
        return Promise.resolve()
      }))

      return CategoryCtrl.create(category, user).then(() => {
        expect(Category.create).to.have.been.calledWith(category)
      })
    })

    it('throws when category name is not unique', () => {
      spies.push(sinon.stub(Category, 'create', () => {
        return Promise.reject({ code: 11000})
      }))

      return expect(CategoryCtrl.create(category, user))
        .to.be.rejectedWith(/should be unique/i)
    })

    it('throws when category with unique name was not created', () => {
      spies.push(sinon.stub(Category, 'create', () => {
        return Promise.reject(new Error('some error'))
      }))

      return expect(CategoryCtrl.create(category, user))
        .to.be.rejectedWith(Error)
    })

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.categories, 'canCreate', () => false))

      return expect(CategoryCtrl.create(category))
        .to.be.rejectedWith(/not authorized/i)

    })
  })

  describe('#get()', () => {
    it('calls Category.find', () => {
      spies.push(sinon.stub(Category, 'find', () => {
        return {
          sort() {
            return this
          },
          lean() {
            return [category]
          }
        }
      }))

      return CategoryCtrl.get().then(() => {
        /* jshint -W030 */
        expect(Category.find).to.have.been.called
      })
    })
  })

  describe('#getById()', () => {
    it('calls Category.findById', () => {
      let categoryId = 123
      spies.push(sinon.stub(Category, 'findById'))

      return CategoryCtrl.getById(categoryId).then(() => {
        expect(Category.findById).to.have.been.calledWith(categoryId)
      })
    })
  })

  describe('#update()', () => {
    it('calls Category.findByIdAndUpdate', () => {
      spies.push(sinon.stub(Category, 'findById', () => {
        return Promise.resolve(category)
      }))
      spies.push(sinon.stub(Category, 'findByIdAndUpdate'))

      return CategoryCtrl.update(category, user).then(() => {
        /* jshint -W030 */
        expect(Category.findByIdAndUpdate).to.have.been.called
      })
    })

    it('throws when category is not in the db', () => {
      category._id = 'nonexistent'
      spies.push(sinon.stub(Category, 'findById', () => {
        return Promise.resolve()
      }))
      spies.push(sinon.stub(Category, 'findByIdAndUpdate'))

      return expect(CategoryCtrl.update(category, user))
        .to.be.rejectedWith(Error)
    })

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.categories, 'canEdit', () => false))

      return expect(CategoryCtrl.update(category, user))
        .to.be.rejectedWith(/not authorized/i)

    })

    it('removes image if it is present', () => {
      const img = 'someimage'
      spies.push(sinon.stub(Category, 'findById', () => {
        return Promise.resolve({image: img})
      }))
      spies.push(sinon.stub(helpers, 'removeImage', () => {
        return Promise.resolve()
      }))
      spies.push(sinon.stub(Category, 'findByIdAndUpdate'))

      return CategoryCtrl.update(category, user).then(() => {
        expect(helpers.removeImage).to.have.been.calledWith(img)
      })
    })
  })

  describe('#remove()', () => {
    it('calls the appropriate functions', () => {
      let categoryId = 123
      category.image = 'someimage'
      spies.push(sinon.stub(Category, 'findById', () => {
        return Promise.resolve(category)
      }))
      spies.push(sinon.stub(helpers, 'removeImage', () => {
        return Promise.resolve()
      }))
      category.remove = sinon.stub().returns(Promise.resolve())

      return CategoryCtrl.remove(categoryId, user).then(() => {
        /* jshint -W030 */
        expect(Category.findById).to.have.been.calledWith(categoryId)
        expect(category.remove).to.have.been.called
        expect(helpers.removeImage).to.have.been.calledWith(category.image)
      })
    })

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.categories, 'canDelete', () => false))

      return expect(CategoryCtrl.remove(category, user))
        .to.be.rejectedWith(/not authorized/i)
    })
  })
})
