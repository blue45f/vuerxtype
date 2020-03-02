import { HttpClient } from "../network/HttpClient";
import { InjectService } from "../application-container/model/InjectService";
import DependencyInjectId from "@/const/DependencyInjectId";
import { LocaleJsonLoader } from "@/global-domain/loader";
import { TransferApi } from "@/apis/transfer/TransferApi";
import { TransferMapper } from "@/service/transfer/TransferMapper";
import { TransferService } from "@/service/transfer/TransferService";

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
  },
  {
    name: DependencyInjectId.TransferApi,
    service: TransferApi
  },
  {
    name: DependencyInjectId.TransferMapper,
    service: TransferMapper
  },
  {
    name: DependencyInjectId.TransferService,
    service: TransferService
  }
];
