class ErrorException extends Error {
  public statusCode: number;

  constructor(statusCode = 400, message = '') {
    super(message);
    this.statusCode = statusCode;
  }
}

const Errors: { [key: string]: typeof ErrorException } = {
  ResultIsCorrupt: class ResultIsCorruptError extends ErrorException {},
  NotFoundView: class NotFoundViewError extends ErrorException {},
  ComponentFail: class ComponentFailError extends ErrorException {},
  NotFoundLayout: class NotFoundLayoutError extends ErrorException {},
};

export { Errors, ErrorException };
