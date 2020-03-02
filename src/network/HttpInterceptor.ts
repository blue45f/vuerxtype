import { Observable } from "rxjs";
import { RequestOptions } from "./RequestOptions";

export interface HttpInterceptor {
  intercept(request: RequestOptions, next: any): Observable<any>;
}
