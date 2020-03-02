import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { injectable, interfaces } from "inversify";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Response } from "./Response";
import { Communicator } from "./Communicator";
import { RequestOptions } from "./RequestOptions";
import { Config } from "../application-container/config/Config";
import { EnvType } from "../const/EnvType";
import InjectionDecorator from "../application-container/InjectionDecorator";
import { applicationContext } from "../application-container/ApplicationContext";
import Bowser from "bowser";
import DependencyInjectId from "@/const/DependencyInjectId";

/**
 * It is an implementation that handles Http communication.
 */
@injectable()
export class HttpClient extends InjectionDecorator implements Communicator {
  protected unsubscribe!: Subject<any>;

  private static readonly browser: Bowser.Parser.Parser = Bowser.getParser(
    window.navigator.userAgent
  );

  private static readonly ieBrowserName: string = "Internet Explorer";

  public static intercept(
    context: interfaces.Context,
    injectableHttpClient: HttpClient
  ): HttpClient {
    const config: Config = context.container.get(
      DependencyInjectId.Configuration
    );

    if (
      EnvType.production !== config.getEnvType() &&
      "true" === config.getEnvItem("MOCK_SERVICE") &&
      applicationContext.getMockLoader
    ) {
      const handler = {
        apply: (target: any, thisArgument: any, argumentsList: any): any => {
          const MOCK_PATH = HttpClient.converterUrlToMockPath(argumentsList[0]);
          const mockData: {
            active: string;
            data: any;
          } = applicationContext.getMockLoader.getMockData(MOCK_PATH);

          let result: any;
          if (mockData && mockData.active) {
            if (console && console.info) {
              console.info("Processing Mock json file :: " + MOCK_PATH);
            }

            result = new Observable((observer: any) => {
              observer.next({ status: 0, statusText: 0, data: mockData.data });
              observer.complete();
            });
          } else {
            result = target.apply(thisArgument, argumentsList);
          }

          return result;
        }
      };

      // Mock을 위한 인터셉터는 개발용이라 IE대응 polifill은 적용하지 않음(모던브라우저에만 동작하도록 처리)
      if (HttpClient.ieBrowserName !== HttpClient.browser.getBrowserName()) {
        injectableHttpClient.get = new Proxy(injectableHttpClient.get, handler);
        injectableHttpClient.post = new Proxy(
          injectableHttpClient.post,
          handler
        );
        injectableHttpClient.put = new Proxy(injectableHttpClient.put, handler);
        injectableHttpClient.delete = new Proxy(
          injectableHttpClient.delete,
          handler
        );
      }
    }

    return injectableHttpClient;
  }

  public get<T>(
    destination: string,
    options: RequestOptions = {}
  ): Observable<AxiosResponse<T>> {
    this.unsubscribe = new Subject<any>();
    this.addTimestampParamBecauseofIE(options);

    options.excludeInterceptor = false;

    return new Observable<AxiosResponse<T>>((observer: any) => {
      this.processCustomParameters(options);

      axios
        .get(destination, options as AxiosRequestConfig)
        .then((response: AxiosResponse<T>) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(HttpClient.converterErrorResponse<T>(error));
        });
    }).pipe(takeUntil(this.unsubscribe));
  }

  public post<T>(
    destination: string,
    data?: any,
    options: RequestOptions = {}
  ): Observable<AxiosResponse<T>> {
    this.unsubscribe = new Subject<any>();

    return new Observable<AxiosResponse<T>>((observer: any) => {
      this.processCustomParameters(options);

      axios
        .post(destination, data, options as AxiosRequestConfig)
        .then((response: AxiosResponse<T>) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(HttpClient.converterErrorResponse(error));
        });
    }).pipe(takeUntil(this.unsubscribe));
  }

  public put<T>(
    destination: string,
    data?: any,
    options: RequestOptions = {}
  ): Observable<AxiosResponse<T>> {
    this.unsubscribe = new Subject<any>();

    return new Observable<AxiosResponse<T>>((observer: any) => {
      this.processCustomParameters(options);

      axios
        .put(destination, data, options as AxiosRequestConfig)
        .then((response: AxiosResponse<T>) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(HttpClient.converterErrorResponse(error));
        });
    }).pipe(takeUntil(this.unsubscribe));
  }

  public delete<T>(
    destination: string,
    options: RequestOptions = {}
  ): Observable<AxiosResponse<T>> {
    this.unsubscribe = new Subject<any>();

    return new Observable<AxiosResponse<T>>((observer: any) => {
      axios
        .delete(destination, options as AxiosRequestConfig)
        .then((response: AxiosResponse<T>) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(HttpClient.converterErrorResponse(error));
        });
    }).pipe(takeUntil(this.unsubscribe));
  }

  public cancel() {
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  }

  public setRequestInterceptor(interceptor: any, errorInterceptor?: any) {
    axios.interceptors.request.use(interceptor, errorInterceptor);
  }

  public setResponseInterceptor(interceptor: any, errorInterceptor?: any) {
    axios.interceptors.response.use(interceptor, errorInterceptor);
  }

  /**
   * when IE browser, add a timestamp for the cache problem.
   *
   * @param requestOptions
   */
  private addTimestampParamBecauseofIE(requestOptions: RequestOptions) {
    requestOptions.params = requestOptions.params || {};
    requestOptions.params.timestemp = new Date().getTime();
  }

  private processCustomParameters(options: RequestOptions): void {
    // remove data : issue axios deep merge from default merge (array -> array like)
    delete options.data;
    // add custom parameters
    options.excludeInterceptor = options.excludeInterceptor || false;
  }

  /* tslint:disable */
  private static converterUrlToMockPath(url: string): string {
    const PRE_FIX = "./apis";
    const POST_FIX = ".json";
    const regUrl = /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w_\\.-]*)*\/?$/;
    let result = "";

    try {
      if (regUrl.test(url)) {
        result = PRE_FIX + regUrl.exec(url)![4];
      } else {
        result = PRE_FIX + "/" + url;
      }

      result = result.replace(/\/$/, "") + POST_FIX;
    } catch (err) {
      if (console && console.error) {
        console.error("At the HttpClient.urlParse", err);
      }
    }

    return result;
  }

  /**
   * Converts to Error response object and returns.
   *
   * @param error
   */
  private static converterErrorResponse<T>(error: any): Response<T> {
    error.response = error.response || {};
    error.response.data = error.response.data || {};

    error.response.status =
      error.response.status || (error.message === "Network Error" ? 805 : 200);
    error.response.statusText = error.response.statusText || error.message;

    error.response.data.code =
      error.response.data.code || error.response.status;
    error.response.data.message =
      error.response.data.message || error.response.statusText;

    return error.response;
  }
}
