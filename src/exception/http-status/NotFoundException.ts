import { HTTPException } from "./HTTPException";

export class NotFoundException extends HTTPException {
  constructor(
    message = "Not Found(404)",
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
      NotFoundException.prototype = Object.getPrototypeOf(this);
    }
  }
}
