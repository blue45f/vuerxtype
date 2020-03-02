import { HTTPException } from "./HTTPException";

export class NoContentException extends HTTPException {
  constructor(
    message = "No Content(204)",
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
      NoContentException.prototype = Object.getPrototypeOf(this);
    }
  }
}
