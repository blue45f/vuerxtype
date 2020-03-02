/**
 * The Exception class is the superclass of all errors and exceptions
 */
export class Exception extends Error {
  public code: number | string | undefined;

  public detailMessage: string | undefined;

  public data: any = {};

  public extension: any = {};

  constructor(
    message: string,
    code?: number | string,
    causeError?: Error,
    detailMessage?: string,
    response?: any
  ) {
    super(message);

    if (causeError) {
      // this.stack += `\nCaused by: ${causeError.stack}`;
    }

    this.code = code;
    this.message = message;
    this.detailMessage = detailMessage;
    this.data = response ? response.data || {} : {};
    this.extension = response ? response.extension || {} : {};

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, new.target.prototype);
    } else {
      Exception.prototype = Object.getPrototypeOf(this);
    }
  }

  public toString(): string {
    let errorMessage = this.name;

    if (this.code) {
      errorMessage += `\nErrorCode[${this.code}]`;
    }

    errorMessage += `\nmessage : ${this.message}`;

    if (this.detailMessage) {
      errorMessage += `\ndetail message : ${this.detailMessage}`;
    }

    errorMessage += `\n${this.stack}`;

    return errorMessage;
  }
}
