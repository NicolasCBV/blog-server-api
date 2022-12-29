import BaseError from "..";

export class HttpProtocol extends BaseError {
  /**
   * This class is used in the treatment of http error's
   * @param name insert the name of error
   * @param statusCode insert the status code used on http protocol
   * @param desc insert the description of this error (if necessary)
   * @param content its optional, but in some cases this arg is used to insert one object
   */
  constructor(
    name: string,
    statusCode: string,
    desc = "This error was generated because httpProtocol",
    content?: object | string
  ) {
    super(name, statusCode, desc, content);
  }
}
