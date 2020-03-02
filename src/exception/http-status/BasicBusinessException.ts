import { HTTPException } from "./HTTPException";

/**
 * 서버(백엔드)에서 처리중 발생한 업무적인 오류에 대한 일반 예외 입니다.
 * 이는 서버에서 정상적으로 거래를 수신하였으나 응답으로 오류를 수신했을때 발생합니다.
 */
export class BasicBusinessException extends HTTPException {
  constructor(
    message = "Basic Business (500)",
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
      BasicBusinessException.prototype = Object.getPrototypeOf(this);
    }
  }
}
