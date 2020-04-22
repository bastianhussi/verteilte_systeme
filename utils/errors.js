/**
 * Custom Error Class. This way it is possible to check
 * which erros where thrown on purpose.
 */
export default class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

/**
 * Errors that result from the behavior of the user.
 * All classes extending from this class will have a statusCode.
 * See: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
export class UserFacingError extends ApplicationError {}

/**
 * Bad request errors will be thrown if a users request
 * cannot be processed.
 * All entries of any optional given object
 * (e.g. the original error, additional information)
 * will be wrapped inside this object.
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
 * Not found error. Will be thrown if no data
 * for a query exists.
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
 * Forbidden errors will be thrown is a user tries to
 * access information he has no access to.
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
 * Unauthorized errors will be thrown if a user tries to
 * access information without authentication.
 * (e.g. Bearer token, cookie with jwt inside)
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
 * Database errors will be thrown if an error occures inside
 * the database layer of this application.
 */
export class DatabaseError extends ApplicationError {
  constructor(message, options = {}) {
    super(message);
    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }
}
