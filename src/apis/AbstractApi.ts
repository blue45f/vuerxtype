import { injectable, postConstruct } from "inversify";
import {
  Observable,
  of,
  OperatorFunction,
  pipe,
  throwError,
  UnaryFunction
} from "rxjs";
import { catchError, map, pluck } from "rxjs/operators";
import { Response } from "../network/Response";
import { RequestOptions } from "../network/RequestOptions";
import { Communicator } from "../network/Communicator";
import { Exception } from "../exception/Exception";
import { ApiInterceptor } from "./ApiInterceptor";
import { DefaultApiInterceptor } from "./DefaultApiInterceptor";
import { Method } from "@/enum/Method";

@injectable()
export abstract class AbstractApi {
  protected http!: Communicator;

  protected apiInterceptor!: ApiInterceptor;

  @postConstruct()
  public postConstruct() {
    if (!this.apiInterceptor) {
      this.setPostInterceptor(new DefaultApiInterceptor());
    }
  }

  public get<T>(requestOptions: RequestOptions): Observable<T> {
    this.setRequestOption(requestOptions, Method.GET);

    return this.http
      .get<T>(requestOptions.url, requestOptions)
      .pipe(this.defaultProcessingChaining<T>(requestOptions, Method.GET));
  }

  public post<T>(requestOptions: RequestOptions): Observable<T> {
    this.setRequestOption(requestOptions, Method.POST);

    return this.http
      .post<T>(
        requestOptions.url,
        this.getPostData(requestOptions),
        requestOptions
      )
      .pipe(this.defaultProcessingChaining<T>(requestOptions, Method.POST));
  }

  public setPostInterceptor(interceptor: ApiInterceptor): void {
    this.apiInterceptor = interceptor;
  }

  protected setRequestOption(
    requestOptions: RequestOptions,
    method?: Method
  ): void {
    // eslint-disable-next-line
    }

  protected getResponseStatus(
    code: number | string,
    response: Response
  ): number {
    return Number(code);
  }

  protected getResponseStatusText(
    message: string | string,
    response: Response
  ): string {
    return message;
  }

  protected getPostData(requestOptions: RequestOptions) {
    return requestOptions.data;
  }

  protected doIndividualProcessing<T>(
    method?: Method
  ): UnaryFunction<Observable<Response<T>>, Observable<T>> {
    return pipe(
      map((response: Response<T>): any => {
        if (this.isSuccessResponse(response, method)) {
          return response.data;
        } else {
          this.resultHandler(response.status, response.statusText, response);
        }
      })
    );
  }

  protected abstract isSuccessResponse(
    response: Response,
    method?: Method
  ): boolean;

  protected abstract createRequestHeaderData(
    customOption: RequestOptions,
    method?: Method
  ): RequestOptions;

  protected abstract converterStandardResponse<T>(
    response: Response<T>,
    method?: Method
  ): Response<T>;

  protected abstract resultHandler(
    resultCode: number,
    resultMessage?: string,
    response?: any
  ): Error;

  private defaultProcessingChaining<T>(
    requestOptions: RequestOptions,
    method?: Method
  ): (response: Observable<Response<T>>) => Observable<T> {
    return pipe(
      this.doIndividualProcessing<T>(method),
      this.postProcessing<T>(requestOptions, method)
    );
  }

  private postProcessing<T>(
    requestOptions: RequestOptions,
    method?: Method
  ): UnaryFunction<Observable<T>, Observable<T>> {
    return (source: Observable<T>) => {
      return source.pipe(
        catchError((error: Exception) => {
          const throwFlower:
            | boolean
            | Observable<T> = this.apiInterceptor.errorInterceptor<T>(
            error,
            requestOptions,
            source
          );
          // throwFlower가 true면 공통처리이후 에러흐름 진행, Observable이면 옵저버블 체이닝 진행 (throwFlower가 전달받은 source라면 retry를 진행할 수 있음)
          return throwFlower === true
            ? throwError(error)
            : (throwFlower as Observable<T>);
        }),
        map((data: T) => {
          return this.apiInterceptor.successInterceptor<T>(
            data,
            requestOptions,
            source
          );
        })
      );
    };
  }
}
