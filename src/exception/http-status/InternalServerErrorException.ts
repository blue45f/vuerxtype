/**
 * 물리적인 서버 오류에 해당하는 예외입니다.
 * 대표적으로 네트워크, 시간초과등의 오류가 해당합니다.
 */
import { HTTPException } from "./HTTPException";

export class InternalServerErrorException extends HTTPException {
  constructor(
    message = "Internal Server Error(500)",
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
      InternalServerErrorException.prototype = Object.getPrototypeOf(this);
    }
  }
}
