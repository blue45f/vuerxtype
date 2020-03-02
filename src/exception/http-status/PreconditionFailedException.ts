import { HTTPException } from "./HTTPException";

export class PreconditionFailedException extends HTTPException {
  constructor(
    message = "Precondition Failed(412)",
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
      PreconditionFailedException.prototype = Object.getPrototypeOf(this);
    }
  }
}
