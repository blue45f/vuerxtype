import { Exception } from "./Exception";

export class UnsupportedOperationException extends Exception {
  constructor(
    message = "Unsupported Operation",
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
      UnsupportedOperationException.prototype = Object.getPrototypeOf(this);
    }
  }
}
