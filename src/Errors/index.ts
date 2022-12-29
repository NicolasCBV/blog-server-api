export default class BaseError extends Error {
  name: string;
  desc: string;
  statusCode: string;
  content: string | object | undefined;

  constructor(
    ErrorName: string,
    Status: string,
    Desc: string,
    Content?: object | string
  ) {
    super(Desc);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ErrorName;
    this.desc = Desc;
    this.statusCode = Status;
    this.content = Content;
  }
}
