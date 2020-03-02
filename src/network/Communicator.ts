import { Response } from "./Response";
import { Observable } from "rxjs";
import { RequestOptions } from "./RequestOptions";
import { AxiosResponse } from "axios";

export interface Communicator {
  /**
   * request a query at the destination.
   *
   * @param destination
   * @param options
   */
  get<T>(
    destination: string | undefined,
    options?: RequestOptions
  ): Observable<AxiosResponse<T>>;

  /**
   * request registration at the destination.
   *
   * @param destination
   * @param data
   * @param options
   */
  post<T>(
    destination: string | undefined,
    data?: any,
    options?: RequestOptions
  ): Observable<AxiosResponse<T>>;

  /**
   * request a correction to the destination.
   *
   * @param destination
   * @param data
   * @param options
   */
  put<T>(
    destination: string | undefined,
    data?: any,
    options?: AxiosResponse
  ): Observable<Response<T>>;

  /**
   * request deletion to destination.
   *
   * @param destination
   * @param options
   */
  delete<T>(
    destination: string | undefined,
    options?: AxiosResponse
  ): Observable<Response<T>>;

  /**
   * request deletion to cancel.
   */
  cancel(): void;

  /**
   * request interceptor to destination.
   *
   * @param interceptor
   */
  setRequestInterceptor(interceptor: any, errorInterceptor?: any): void;

  /**
   * response interceptor to destination.
   *
   * @param interceptor
   */
  setResponseInterceptor(interceptor: any, errorInterceptor?: any): void;
}
