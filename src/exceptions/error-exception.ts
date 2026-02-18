export class ErrorException extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode || 500;

    Object.setPrototypeOf(this, ErrorException.prototype);
  }
}
