import mongoose from 'mongoose';
import helpers from '../helpers';
import EventController from './events.controller';

/* jshint ignore: start */
export default {
  create,
  get,
  getById,
  update,
  remove,
  send
};

async function create(req, res) {
  let event = parseEvent(req.body);
  helpers.addAudit(event, req);
  event = await EventController.create(event, req.user);

  return res.status(201).send(event);
}

async function update(req, res) {
  let event = parseEvent(req.body);
  event = await EventController.update(event, req.user);

  return res.status(211).send(event);
}

async function get(req, res) {
  let queryParams = req.query || {};
  const distinct  = !queryParams.allOccurences;
  let events = distinct ? await EventController.getDistinct(queryParams, req.user) :
    await EventController.get(queryParams, req.user);

  return res.send(events);
}

async function getById(req, res) {
  let eventId = req.params.id;
  let event = await EventController.getById(eventId, req.user);

  return res.send(event);
}

async function remove(req, res) {
  let eventId = req.params.id;
  let event = await EventController.remove(eventId, req.user);

  return res.status(212).send(event);
}

async function send(req, res) {
  let eventId = req.params.id,
    email = req.body.email,
    result = await EventController.send(eventId, email);

  return res.status(200).send(result);
}

function parseEvent(event) {
  return Object.assign({}, event, {
    category: mongoose.Types.ObjectId(event.category),
    startDate: new Date(event.startDate)
  });
}
/* jshint ignore: end */
