import { RequestOptions } from "./RequestOptions";

export interface Response<T = any> {
  /**
   * response body
   */
  data: T;

  /**
   * response extension body
   */
  extension?: any;

  /**
   * response status code
   */
  status: number;

  /**
   * response status text
   */
  statusText: string;

  /**
   * transport headers
   */
  headers?: any;

  /**
   * request options
   */
  config?: RequestOptions;

  /**
   * request object
   */
  request?: any;

  /**
   * response value
   */
  value?: any;
}
