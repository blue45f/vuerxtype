import { Exception } from "./Exception";

export class NotImplementedException extends Exception {
  constructor(
    message = "Not Implemented",
    code?: number | string,
    causeError?: Error,
    detailMessage?: string
  ) {
    super(message, code, causeError, detailMessage);

    if (causeError) {
      // super.stack += `\nCaused by: ${causeError.stack}`;
    }

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      NotImplementedException.prototype = Object.getPrototypeOf(this);
    }
  }
}
