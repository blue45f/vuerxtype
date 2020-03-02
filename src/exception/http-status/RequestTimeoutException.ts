import { HTTPException } from "./HTTPException";

export class RequestTimeoutException extends HTTPException {
  constructor(
    message = "Request Timeout(408)",
    code?: number | string,
    causeError?: Error,
    detailMessage?: string
  ) {
    super(message, code, causeError, detailMessage);

    if (causeError) {
      super.stack += `\nCaused by: ${causeError.stack}`;
    }

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      RequestTimeoutException.prototype = Object.getPrototypeOf(this);
    }
  }
}
