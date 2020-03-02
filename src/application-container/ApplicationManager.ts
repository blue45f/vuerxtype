import { applicationContext } from "./ApplicationContext";
import { Config } from "./config/Config";
import { Application } from "../Application";
import MockLoader from "./MockLoader";
import { ApplicationConfig } from "./config/ApplicationConfig";
import { InjectService } from "./model/InjectService";
import RequireContext = __WebpackModuleApi.RequireContext;

/**
 * Application Manager
 * Creates application container and registers and manages modules.
 */
export class ApplicationManager {
  private services!: Array<InjectService>;

  private readonly config: Config;

  private BootstrapApplication: Class;

  private mockLoader!: MockLoader;

  constructor(
    configs: Array<{ key: string; config: any }> = [],
    BootstrapApplication: Class
  ) {
    if (console && console.log) {
      console.log("load ApplicationManager");
    }

    this.BootstrapApplication = BootstrapApplication;
    this.config = new ApplicationConfig(configs);
  }

  public setService(services: Array<InjectService>): ApplicationManager {
    this.services = services;
    return this;
  }

  public setMockLoader(store: RequireContext): ApplicationManager {
    this.mockLoader = new MockLoader(store);
    return this;
  }

  /**
   * bootstrap Application
   *
   * @param selector
   */
  public bootstrap(selector: string): void {
    document.addEventListener("DOMContentLoaded", e => {
      this.config.init().then(() => {
        this.initializeContext();

        if (console && console.log) {
          console.log("bootstrap Application");
        }

        (new this.BootstrapApplication() as Application).load(selector);
      });
    });
  }

  private initializeContext(): void {
    applicationContext.setConfig(this.config);
    applicationContext.setServices(this.services);
    applicationContext.setMockLoader(this.mockLoader);
  }
}
