class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.msg = message; // renamed to msg due to parsing issue
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export class BadRequestError extends ExtendableError {
  constructor(message) {
    super(message);

    this.statusCode = 400;
  }
}

export class NotAuthorizedError extends ExtendableError {
  constructor(message) {
    super(message);

    this.statusCode = 401;
  }
}

export class ForbiddenError extends ExtendableError {
  constructor(message) {
    super(message);

    this.statusCode = 403;
  }
}

export class NotFoundError extends ExtendableError {
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

export default {
  BadRequestError,
  NotAuthorizedError,
  ForbiddenError,
  NotFoundError
};
