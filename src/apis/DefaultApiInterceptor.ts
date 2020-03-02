import { RequestOptions } from "../network/RequestOptions";
import { Exception } from "../exception/Exception";
import { Observable } from "rxjs";
import { ApiInterceptor } from "./ApiInterceptor";
import { injectable } from "inversify";

@injectable()
export class DefaultApiInterceptor implements ApiInterceptor {
  /**
   * API 에러 처리 인터셉터
   * @param error 원인 에러 객체
   * @param requestOptions 거래 요청 속성
   * @param source 원본 스트림
   * @return throwFlow true: throw Error Flow, channing next Observable
   */
  public errorInterceptor<T>(
    error: Exception,
    requestOptions: RequestOptions,
    source: Observable<T>
  ): boolean | Observable<T> {
    return true;
  }

  /**
   * API 정상 처리 인터셉터
   * @param data API응답데이터
   * @param requestOptions 거래요청 속성
   * @param source 원본 스트림
   * @return 응답처리데이터
   */
  public successInterceptor<T>(
    data: T,
    requestOptions: RequestOptions,
    source: Observable<T>
  ): T {
    return data;
  }
}
