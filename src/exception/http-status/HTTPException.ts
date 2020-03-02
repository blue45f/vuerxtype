import { Exception } from "../Exception";

/**
 * The HTTPException exception represents a HTTP fault
 */
export class HTTPException extends Exception {
  constructor(
    message: string,
    code?: number | string,
    causeError?: Error,
    detailMessage?: string,
    data?: object
  ) {
    super(message, code, causeError, detailMessage, data);

    if (causeError) {
      super.stack += `\nCaused by: ${causeError.stack}`;
    }

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      HTTPException.prototype = Object.getPrototypeOf(this);
    }
  }
}
