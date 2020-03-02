import { HTTPException } from "./HTTPException";

export class HttpResponseException extends HTTPException {
  constructor(
    message: string,
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
      HttpResponseException.prototype = Object.getPrototypeOf(this);
    }
  }
}
