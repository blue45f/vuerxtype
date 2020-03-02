import { Exception } from "../exception/Exception";
import { RequestOptions } from "../network/RequestOptions";
import { Observable } from "rxjs";

/**
 * Api 인터셉터 인터페이스이다.
 * API 인터셉터는 ApiInterceptor를 상속해서 구현해야 한다.
 */
export interface ApiInterceptor {
  /**
   * API 에러 처리 인터셉터
   * @param error 원인 에러 객체
   * @param requestOptions 거래 요청 속성
   * @param source 원본 스트림
   * @return throwFlow true: throw Error Flow, channing next Observable
   */
  errorInterceptor<T>(
    error: Exception,
    requestOptions: RequestOptions,
    source: Observable<T>
  ): boolean | Observable<T>;

  /**
   * API 정상 처리 인터셉터
   * @param data API응답데이터
   * @param requestOptions 거래요청 속성
   * @param source 원본 스트림
   * @return 응답처리데이터
   */
  successInterceptor<T>(
    data: T,
    requestOptions: RequestOptions,
    source: Observable<T>
  ): T;
}
