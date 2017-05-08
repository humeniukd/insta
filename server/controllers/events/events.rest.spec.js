import httpMocks from 'node-mocks-http';
import EventsRestController from './events.rest.controller';
import EventController from './events.controller';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { beforeEach, describe, it, afterEach, before, after } from 'mocha';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('REST Controller: Events', () => {
  let req, res, spies = {};

  let event = {
    email: 'Auto_EPM-TRN_Activities@epam.com',
    name: '123',
    description: '456'
  };

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'POST',
      body: event,
      params: {
        id: 1
      }
    });
    req.user = {_id: 1};
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    Object.keys(spies).map((spy) => {
      spies[spy].restore();
    });
  });

  describe('#create()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'create', () => Promise.resolve());

      return EventsRestController.create(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.create).to.have.been.called;

        let calledEvent = EventController.create.getCall(0).args[0];
        let calledUser = EventController.create.getCall(0).args[1];

        expect(calledEvent).toContain(event);
        expect(calledUser).toBe(req.user);

        EventController.create.restore();
      });
    });
  });

  describe('#update()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'update', () => Promise.resolve());

      return EventsRestController.update(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.update).to.have.been.called;

        let calledEvent = EventController.update.getCall(0).args[0];
        let calledUser = EventController.update.getCall(0).args[1];

        expect(calledEvent).toContain(event);
        expect(calledUser).toBe(req.user);

        EventController.update.restore();
      });
    });
  });

  describe('#get()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'getDistinct', () => Promise.resolve());

      return EventsRestController.get(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.getDistinct).to.have.been.called;

        EventController.getDistinct.restore();
      });
    });
    it('calls the right functions #2', () => {
      sinon.stub(EventController, 'get', () => Promise.resolve());
      req.query = {allOccurences: 1};
      return EventsRestController.get(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.get).to.have.been.called;

        EventController.get.restore();
      });
    });
  });

  describe('#getById()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'getById', () => Promise.resolve());

      return EventsRestController.getById(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.getById).to.have.been.called;

        EventController.getById.restore();
      });
    });
  });

  describe('#remove()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'remove', () => Promise.resolve());

      return EventsRestController.remove(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.remove).to.have.been.called;

        let calledEventId = EventController.remove.getCall(0).args[0];
        let calledUser = EventController.remove.getCall(0).args[1];

        expect(calledEventId).toBe(req.params.id);
        expect(calledUser).toBe(req.user);

        EventController.remove.restore();
      });
    });
  });
  describe('#send()', () => {
    it('calls the right functions', () => {
      sinon.stub(EventController, 'send', () => Promise.resolve());

      return EventsRestController.send(req, res).then(() => {
        /* jshint -W030 */
        expect(EventController.send).to.have.been.called;

        let calledEventId = EventController.send.getCall(0).args[0];
        let calledEmail = EventController.send.getCall(0).args[1];

        expect(calledEventId).toBe(req.params.id);
        expect(calledEmail).toBe(req.body.email);
        console.log('sendEvent', req);

        EventController.send.restore();
      });
    });
  });
});
