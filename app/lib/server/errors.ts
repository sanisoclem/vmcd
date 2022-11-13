export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message === undefined ? 'Invalid request' : message);
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message === undefined ? 'Resource was not found' : message);
  }
}

export class NotAuthenticatedError extends Error {}

export class NotAuthorizedError extends Error {}
