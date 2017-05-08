import mongoose from 'mongoose';
import moment from 'moment';
import uuid from 'uuid';
import Event from '../../models/event.model';
import { BadRequestError } from '../../utils/errors';

/* jshint ignore: start */
export default {
  create,
  update,
  remove
};

async function create(event) {
  event.groupId = generateGroupId();
  event.recurrenceStartDate = event.startDate;
  const duration = moment(event.endDate).diff(moment(event.startDate));
  // proposed recurrence end date (before calculation)
  let proposedRecurrenceEndDate = event.recurrenceEndDate ||
    moment(event.startDate).add(1, 'years');

  let occurrenceDates = getOccurrenceDates(
      event.recurrenceType,
      event.startDate,
      proposedRecurrenceEndDate
    );

  // actual recurrence end date (after calculation)
  event.recurrenceEndDate = occurrenceDates[occurrenceDates.length - 1];

  let eventPromises = occurrenceDates.map((occurenceDate) => {
    event.startDate = occurenceDate;
    event.endDate = moment(occurenceDate).add(duration).toDate();
    return Event.create(event);
  });

  let events = await Promise.all(eventPromises);

  event = events[0].toObject();
  event.numOfCreatedEvents = events.length;
  return event;
}

async function update(event) {
  let options = {
    runValidators: true,
    context: 'query',
    multi: true
  };
  delete event._id;
  return Event.update({ groupId: event.groupId }, event, options);
}

async function remove(groupId) {
  let events = await Event.find({groupId});
  let eventPromises = events.map((event) => {
    return event.remove();
  });

  await Promise.all(eventPromises);
}

/*** helpers ***/

function generateGroupId() {
  return uuid.v1();
}

function getOccurrenceDates(recurrenceType, startDate, endDate) {
  let occurrenceDates = [];

  for (let occurence of occurrenceDatesGen(recurrenceType, startDate, endDate)) {
    occurrenceDates.push(occurence.toDate());
  }

  if (occurrenceDates.length === 0) {
    throw new BadRequestError('The provided date range will not create any event occurences');
  }

  return occurrenceDates;
}

function* occurrenceDatesGen(recurrenceType, startDate, endDate) {
  let { step, unit } = prepareRecurrenceParams(recurrenceType);
  let { start, end } = prepareRecurrenceDates(startDate, endDate);
  let current = start;

  while (current <= end) {
    yield current;
    current.add(step, unit);
  }
}

function prepareRecurrenceDates(start, end) {
  start = moment(start);
  if (end) {
    end = moment(end);
  } else {
    end = moment(start).add(1, 'years');
  }

  return { start, end };
}

function prepareRecurrenceParams(recurrenceType) {
  switch (recurrenceType) {
    case 'daily':
      return { step: 1, unit: 'days' };
    case 'weekly':
      return { step: 1, unit: 'weeks' };
    case 'monthly':
      return { step: 1, unit: 'months' };
    default:
      throw new BadRequestError(`Unknown recurrence type: ${recurrenceType}`);
  }
}
