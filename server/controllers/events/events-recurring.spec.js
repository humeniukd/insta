import EventRecController from './events-recurring.controller';
import Category from '../../models/category.model';
import Event from '../../models/event.model';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { beforeEach, describe, it, afterEach, before, after } from 'mocha';
import faker from 'faker';
import helper from '../../../test.backend.helper';

chai.use(chaiAsPromised);

describe('Controller: Recurring Events', () => {
  let event;
  let category;

  before((done) => helper.connect(done));

  before((done) => {
    Category.create({name: 'TEST CATEGORY'})
      .then((createdCategory) => {
        category = createdCategory;
        done();
      })
      .catch(console.error);
  });

  beforeEach(() => {
    event = {
      title: faker.name.firstName(),
      location: [
        5,
        10
      ],
      category: category._id,
      startDate: JSON.parse(JSON.stringify(new Date())),
      recurrence: true,
      recurrenceType: 'monthly',
      description: 'description'
    };
  });

  afterEach((done) => helper.clear(done));
  after((done) => helper.close(done));

  describe('#create()', () => {
    it('creates events', (done) => {
      EventRecController.create(event)
        .then((event) => {
          expect(event.numOfCreatedEvents).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('#remove()', () => {
    it('deletes events', (done) => {
      /* jshint ignore:start */
      testRemove()
        .then(done)
        .catch(console.error);

      async function testRemove() {
        let createdEvent = await EventRecController.create(event);
        await EventRecController.remove(createdEvent.groupId);
        let events = await Event.find({groupId: createdEvent.groupId});

        expect(events.length).toBe(0);
      }
      /* jshint ignore:end */
    });
  });
});
