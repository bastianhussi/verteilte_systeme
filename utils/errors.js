/**
 *
 */
export default class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

/**
 *
 */
export class UserFacingError extends ApplicationError { }

/**
 *
 */
export class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 400;
  }
}

/**
 *
 */
export class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 404;
  }
}

/**
 *
 */
export class ForbiddenError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 403;
  }
}

/**
 *
 */
export class UnauthorizedError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 401;
  }
}

/**
 *
 */
export class DatabaseError extends ApplicationError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }
}
