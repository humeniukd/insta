/* jshint -W117, -W030 */
import mongoose from 'mongoose';
import moment from 'moment';
import Event from '../../models/event.model';
import RecurringEvents from './events-recurring.controller';
import {ForbiddenError, NotFoundError, BadRequestError} from '../../utils/errors';
import PermissionService from '../../../common/permission.service';
import EventsMapper from '../../mappers/events.mapper';
import nodemailer from 'nodemailer';
import config from '../../config';
import uuid from 'uuid';
import _ from 'lodash';

/* jshint ignore: start */
export default {
  create,
  get,
  getDistinct,
  getById,
  update,
  remove,
  send
};

async function create(event, user) {
  if (!PermissionService.events.canCreate(user)) {
    throw new ForbiddenError('You\'re not authorized to create events');
  }

  if (!event.endDate) {
    event.endDate = event.startDate;
  }

  if (event.recurrence) {
    event = await RecurringEvents.create(event);
  } else {
    event = await Event.create(event);
  }
  return event;
}

async function getDistinct(queryParams, user) {
  const operations = [],
    {lat, lng, distance = 30000} = queryParams;
  const match = buildMatchConditions(queryParams);
  const sort = buildSortOptions(queryParams);
  const {limit, skip} = buildLimitSkipOptions(queryParams);
  const location = getLocationCondition(lng, lat, distance);

  if (location) {
    operations.push(location)
  }
  operations.push({
    $match: match
  });
  operations.push({
    $group: {
      _id: '$groupId',
      event: {'$first': '$$ROOT'}
    }
  });
  Object.keys(sort).length !== 0 && operations.push({
    $sort: sort
  });
  operations.push(
    { '$skip': skip },
    { '$limit': limit }
  );
  const events = await runAggregate(operations);

  return events.map((event) => EventsMapper.mapModelToDto(event, user));
}

async function get(queryParams, user) {
  const match = buildMatchConditions(queryParams);
  const sort = buildSortOptions(queryParams);
  const {limit, skip} = buildLimitSkipOptions(queryParams);
  const events = await Event.find(match, null, {sort, limit, skip}, (err, events) => {
    if (err) {
      throw err;
    }
    return events;
  }).lean();

  return events.map((event) => EventsMapper.mapModelToDto(event, user));
}

async function getById(eventId, user) {
  const event = await Event.findById(eventId)
  .populate('category', 'name description')
  .populate('createdBy', 'userName _id avatar')
  .lean();

  return EventsMapper.mapModelToDto(event, user);
}

async function update(event, user) {
  if (!PermissionService.events.canEdit(user, event)) {
    throw new ForbiddenError('You\'re not authorized to edit events');
  }

  let isRecurring = event.recurrence;
  let options = {
    runValidators: true,
    context: 'query'
  };
  removeNonEditableFields(event);

  if (isRecurring) {
    return RecurringEvents.update(event);
  }
  return Event.findByIdAndUpdate(event._id, event, options);
}

async function remove(eventId, user) {
  let event = await Event.findById(eventId);

  if (!PermissionService.events.canDelete(user, event)) {
    throw new ForbiddenError('You\'re not authorized to delete events');
  }

  if (!event) {
    throw new NotFoundError(`Event with ID ${eventId} not found!`);
  }

  if (event.recurrence) {
    return RecurringEvents.remove(event.groupId);
  }
  return event.remove();
}

function buildMatchConditions(queryParams = {}) {
  const conditions = [];

  if (queryParams.startDate) {
    conditions.push({
      startDate: { $gte: new Date(queryParams.startDate) }
    });
  }

  if (queryParams.endDate) {
    conditions.push({
      endDate: { $lte: new Date(queryParams.endDate) }
    });
  }

  let categoryCondition = getCategoryCondition(queryParams.category);
  if (categoryCondition) {
    conditions.push({
      category: categoryCondition
    });
  }

  if (queryParams.groupId) {
    conditions.push({
      groupId: queryParams.groupId
    })
  }

  const userConditions = getUserCondition(queryParams.user);
  if (userConditions) {
    conditions.push(userConditions);
  }

  return conditions.length ? {$and: conditions} : {};
}

function getLocationCondition(lng, lat, distance) {
  if (lng && lat) {
    return {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        distanceField: 'distance',
        maxDistance: parseInt(distance),
        spherical: true
      }
    };
  }
}

function getCategoryCondition(category) {
  if (category) {
    return mongoose.Types.ObjectId(category);
  }
}

function getUserCondition(user) {
  if (user) {
    const userId = mongoose.Types.ObjectId(user);
    return {
      $or: [{ createdBy: userId }, { subscribers: userId }]
    };
  }
}

async function runAggregate(operations) {
  let rows = await Event.aggregate(operations);

  return rows.map((row) => {
    return row.event;
  });
}

function buildSortOptions(queryParams = {}) {
  const options = {};
  const distinct = !queryParams.allOccurences;
  const sort = queryParams.sort;
  if (sort) {
    Object.keys(sort).map((key) => {
      options[distinct ? `event.${key}` : key] = parseInt(sort[key]);
    });
  }
  return options;
}

function buildLimitSkipOptions(queryParams = {}) {
  const {limit = 100, skip = 0} = queryParams;
  return {limit: parseInt(limit), skip: parseInt(skip)};
}

// jscs:disable disallowMultipleLineStrings
const emailTmpl = _.template('<html><head>\
  <style>p{font-size:14pt;line-height:110%;font-family:"Arial",sans-serif;color:#464547}</style>\
  </head><body>\
  <p>Dear <%= user %>, the event <b><%= name %></b> is waiting for your confirmation.</p>\
  <p>It will occurs <b><%= startDate %>\
  <% if (recurrence) { %>\
    till <%= endDate %>, <%= recurrence %>\
  <% } %>\
  at <%= startTime %></b>.</p>\
  <p><% if (price) { %>\
    Event costs <%= price %>.\
  <% } else { %>\
    Event is free.\
  <% } %></p>\
  <p>Location: <b><%= location %></b>.</p>\
  <p><%= description %></p>\
  </body></html>'
);

async function send(eventId, email) {
  const event = await Event.findById(eventId);
  const startDate = moment.utc(event.startDate);
  const startDateTs = startDate.format('YYYYMMDDTHHmmss');
  const endDate = moment.utc(event.endDate).format('YYYYMMDDTHHmmss');
  const recurrenceEndDate = moment.utc(event.recurrenceEndDate).add(1000); //workaround
  const recurrenceEndTz = recurrenceEndDate.format('YYYYMMDDTHHmmss');
  const dtStamp = moment.utc().format('YYYYMMDDTHHmmss');
  const freq = event.recurrenceType.toUpperCase();
  const now = moment.utc();
  const uid = uuid.v4();
  if (!event) {
    throw new NotFoundError(`Event with ID ${eventId} not found!`);
  }
  if (recurrenceEndDate.isBefore(now)) {
    throw new BadRequestError(`Event with ID ${eventId} passed!`);
  }
  const mailOptions = {
    from: config.email,
    to: email,
    subject: event.title,
    text: event.description,
    html: emailTmpl({
      user: email,
      name: event.title,
      startDate: startDate.format('MMMM D YYYY'),
      startTime: startDate.format('h:mm A'),
      endDate: recurrenceEndDate.format('MMMM D YYYY'),
      recurrence: event.recurrenceType,
      price: event.price,
      location: event.locationName,
      description: event.description
    }),
    icalEvent: {
      method: 'request',
      // jscs:disable maximumLineLength
      content: `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nDTSTART:${startDateTs}Z\r\nRRULE:FREQ=${freq};UNTIL=${recurrenceEndTz}Z\r\nDTEND:${endDate}Z\r\nDESCRIPTION:${event.description}\r\nSUMMARY:${event.title}\r\nORGANIZER; CN="OOA":mailto:${config.email}\r\nLocation:${event.locationName}\r\nUID:${uid}\r\nSEQUENCE:0\r\nDTSTAMP:${dtStamp}Z\r\nBEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:Reminder\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`
    }
  };
  const transporter = nodemailer
      .createTransport(config.smtp);
  return await transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error, info);
    }
  });
}

function removeNonEditableFields(event) {
  delete event.subscribers;
  delete event.recurrence;
  delete event.recurrenceType;
  delete event.recurrenceStartDate;
  delete event.recurrenceEndDate;
  delete event.startDate;
  delete event.endDate;
  delete event.createdAt;
  delete event.createdBy;
}
