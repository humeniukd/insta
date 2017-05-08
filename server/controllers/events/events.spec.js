import EventsController from './events.controller';
import Category from '../../models/category.model';
import Event from '../../models/event.model';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { beforeEach, describe, it, afterEach, before, after } from 'mocha';
import mongoose from 'mongoose';
import ObjectId from 'mongoose/lib/types/objectid';
import helper from '../../../test.backend.helper';
import PermissionService from '../../../common/permission.service';
import EventsMapper from '../../mappers/events.mapper';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Controller: Events', () => {
  let event = {
    title: 'title test',
    location: [
      5,
      10
    ],
    description: 'description test',
    startDate: JSON.parse(JSON.stringify(new Date()))
  };

  let queryParams = {
    startDate: JSON.parse(JSON.stringify(new Date())),
    category: '57dfbef78e7f1e1a2081c0bd'
  };

  let user = {
    _id: new ObjectId().toString(),
    role: 'admin'
  };

  let EventModel = {
    find: function() {
      return this;
    },
    findById: function() {
      return this;
    },
    populate: function() {
      return this;
    },
    lean: function() {
      return [event];
    }
  };

  let category, spies;

  function createEvent(event) {
    return EventsController.create(event, user);
  }

  function removeEvent(eventId) {
    return EventsController.remove(eventId, user);
  }

  before((done) => {
    helper.connect(done);
  });

  before((done) => {
    Category.create({name: 'TEST CATEGORY'})
      .then((createdCategory) => {
        category = createdCategory;
        event.category = category._id;
        done();
      })
      .catch((err) => {
        console.error(err);
      });
  });

  beforeEach(() => {
    spies = [];
  });

  after((done) => {
    helper.close(done);
  });

  afterEach((done) => {
    helper.clear(done);
  });

  afterEach(() => {
    spies.map((spy) => {
      spy.restore();
    });
  });

  describe('#create()', () => {
    it('creates event', (done) => {
      EventsController.create(event)
        .then((createdEvent) => {
          expect(createdEvent.title).toBe(event.title);
          done();
        })
        .catch((err) => {
          console.error(err);
        });
    });

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.events, 'canCreate', () => false));

      return expect(EventsController.create(event))
        .to.be.rejectedWith(/not authorized/i);

    });
  });

  describe('#get()', () => {
    it('calls mapModelToDto', () => {
      spies.push(sinon.stub(Event, 'find').returns(EventModel));
      spies.push(sinon.stub(EventsMapper, 'mapModelToDto').returns(Promise.resolve([event])));

      return EventsController.get({query:{allOccurences:1}}, user)
        .then(() => {
          /* jshint -W030 */
          expect(Event.find).to.have.been.called;
          expect(EventsMapper.mapModelToDto).to.have.been.called;
        });
    });
  });

  describe('#getById()', () => {
    it('calls mapModelToDto', () => {
      spies.push(sinon.stub(Event, 'findById').returns(EventModel));
      spies.push(sinon.stub(EventsMapper, 'mapModelToDto').returns(Promise.resolve(event)));

      return EventsController.getById('123abc', user)
        .then(() => {
          /* jshint -W030 */
          expect(Event.findById).to.have.been.called;
          expect(EventsMapper.mapModelToDto).to.have.been.called;
        });
    });
  });

  describe('#update()', () => {
    it('updates event', () => {
      spies.push(sinon.spy(Event, 'findByIdAndUpdate'));
      let eventForUpdate = Object.assign({}, event);

      EventsController.update(eventForUpdate, user)
        .then(() => {
          /* jshint -W030 */
          expect(Event.findByIdAndUpdate).to.have.been.called;
        });
    });

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.events, 'canEdit', () => false));

      return expect(EventsController.update(event))
        .to.be.rejectedWith(/not authorized/i);
    });
  });

  describe('#remove()', () => {
    it('removes event', (done) => {
      let eventToBeRemoved;

      createEvent(event)
        .then((createdEvent) => {
          eventToBeRemoved = createEvent;
          return removeEvent(createdEvent._id);
        })
        .then(() => {
          return Event.findById(eventToBeRemoved._id)
            .then((event) => {
              /* jshint -W030 */
              expect(event).to.be.falsy;
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it('removes event reference from category', (done) => {
      let eventToBeRemoved;

      createEvent(event)
        .then((createdEvent) => {
          eventToBeRemoved = createEvent;
          return removeEvent(createdEvent._id);
        })
        .then(() => {
          return Category.find({events: eventToBeRemoved._id})
            .then((category) => {
              /* jshint -W030 */
              expect(category).to.be.falsy;
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it('throws when user is not authorized', () => {
      spies.push(sinon.stub(PermissionService.events, 'canDelete', () => false));
      spies.push(sinon.stub(Event, 'findById', () => 1));

      return expect(EventsController.remove())
        .to.be.rejectedWith(/not authorized/i);
    });
  });
});
