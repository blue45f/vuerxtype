import { HttpClient } from "../network/HttpClient";
import { InjectService } from "../application-container/model/InjectService";
import DependencyInjectId from "@/const/DependencyInjectId";
import { LocaleJsonLoader } from "@/global-domain/loader";

export const SERVICES: Array<InjectService> = [
  {
    name: DependencyInjectId.HttpClient,
    service: HttpClient,
    scope: undefined,
    handler: HttpClient.intercept
  },
  {
    name: DependencyInjectId.LocaleJsonLoader,
    service: LocaleJsonLoader
  }
];
