import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import { Config } from "./config/Config";
import MockLoader from "./MockLoader";
import { InjectService } from "./model/InjectService";
import { InjectScope } from "../const/InjectScope";
import { interfaces } from "inversify/dts/interfaces/interfaces";
import DependencyInjectId from "@/const/DependencyInjectId";

/**
 * Application Context
 * It has the life cycle of the application.
 */

class ApplicationContext {
  private config!: Config;

  private readonly iocContainer: Container;

  private mockLoader!: MockLoader;

  public constructor() {
    this.iocContainer = new Container({ defaultScope: "Singleton" });
  }

  public setConfig(config: Config): void {
    this.config = config;
    this.iocContainer
      .bind<Config>(DependencyInjectId.Configuration)
      .toConstantValue(this.config);
  }

  public setServices(services: Array<InjectService>): void {
    services.reduce((that, service: InjectService) => {
      that.registerService(service);
      return that;
    }, this);
  }

  public setMockLoader(mockLoader: MockLoader): void {
    this.mockLoader = mockLoader;
  }

  public get getMockLoader() {
    return this.mockLoader;
  }

  public registerService<T>(service: InjectService): void {
    const invokeService: interfaces.BindingWhenOnSyntax<T> = this.bindService<
      T
    >(service);
    this.onHandler<T>(invokeService, service);
  }

  public provideService<T>(serviceName: string | symbol): T {
    return this.iocContainer.get<T>(serviceName);
  }

  public lazyInject(): any {
    return getDecorators(this.iocContainer);
  }

  private bindService<T>(
    service: InjectService
  ): interfaces.BindingWhenOnSyntax<T> {
    let bindingWhenOnSyntax: interfaces.BindingWhenOnSyntax<T>;

    if (InjectScope.Transient === service.scope) {
      bindingWhenOnSyntax = this.iocContainer
        .bind<T>(service.name)
        .to(service.service)
        .inTransientScope();
    } else if (InjectScope.Request === service.scope) {
      bindingWhenOnSyntax = this.iocContainer
        .bind<T>(service.name)
        .to(service.service)
        .inRequestScope();
    } else {
      bindingWhenOnSyntax = this.iocContainer
        .bind<T>(service.name)
        .to(service.service)
        .inSingletonScope();
    }

    return bindingWhenOnSyntax;
  }

  private onHandler<T>(
    invokeService: interfaces.BindingWhenOnSyntax<T>,
    service: InjectService
  ): interfaces.BindingWhenOnSyntax<T> {
    if (service.handler) {
      invokeService.onActivation(service.handler);
    }

    return invokeService;
  }
}

// use to singleton
const applicationContext = new ApplicationContext();
const {
  lazyInject,
  lazyInjectNamed,
  lazyInjectTagged,
  lazyMultiInject
} = applicationContext.lazyInject();

export {
  applicationContext,
  lazyInject,
  lazyInjectNamed,
  lazyInjectTagged,
  lazyMultiInject
};
