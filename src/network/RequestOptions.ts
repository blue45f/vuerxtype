/**
 * It is the definition of the request settings.
 */
export interface RequestOptions {
  url?: string;
  method?: string;
  baseURL?: string;
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  maxContentLength?: number;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  cancelToken?: any;
  excludeInterceptor?: boolean;
}
