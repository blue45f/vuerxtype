import { Config } from "./Config";
import { UnsupportedOperationException } from "../../exception/UnsupportedOperationException";
import axios from "axios";
import merge from "deepmerge";
import { Response } from "../../network/Response";

declare global {
  interface Window {
    $run_type$: string;
    $platform$: string;
  }
}

const loaderConfigs: Promise<Array<any>> = (() => {
  const configs = [
    new Promise((resolve: any) => {
      axios
        .get("/config/run-type/config.json")
        .then((response: Response<any>) => resolve(response.data))
        .catch((reason: any) => resolve({}));
    }),
    new Promise((resolve: any) => {
      axios
        .get("/config/platform/config.json")
        .then((response: Response<any>) => resolve(response.data))
        .catch((reason: any) => resolve({}));
    })
  ];

  return Promise.all(configs);
})();

/**
 * Configuration for User CommunityItemModel Home Application
 */
export class ApplicationConfig implements Config {
  private envPrefix = "VUE_APP_";
  private platformPrefix = "$$PLATFORM$$";
  private config: any = {};

  private configs: Array<{ key: string; config: any }> = [];

  /**
   * 생성자이다.
   *
   * @param configs
   */
  constructor(configs: Array<{ key: string; config: any }> = []) {
    this.configs = configs;
  }

  public init(): Promise<any> {
    return loaderConfigs.then(([runTypeConfig, platformConfig]) => {
      this.config = merge.all([
        {},
        process.env,
        runTypeConfig,
        { $$PLATFORM$$: platformConfig }
      ]);

      this.configs.reduce((target: any, source: any) => {
        target[source.key] = source.config;

        return target;
      }, this.config);

      return this.config;
    });
  }

  /**
   * 환경유형을 반환한다.
   */
  public getEnvType(): string {
    return process.env.NODE_ENV || "development";
  }

  /**
   * 구동유형을 반환한다.
   */
  public getRunType(): string {
    return this.getItem("RUN_TYPE", "dev");
  }

  /**
   * 플랫폼 유형을 반환한다.
   */
  public getPlatformType(): string {
    return this.getItem(`${this.platformPrefix}.PLATFORM_TYPE`, "pc");
  }

  /**
   * ENV설정정보를 반환한다.
   *
   * @param key
   * @param defaultValue
   */
  public getEnvItem(key: any, defaultValue?: any): any {
    return this.getItem(`${this.envPrefix}${key}`, defaultValue);
  }

  /**
   * PLATFORM 설정정보를 반환한다.
   *
   * @param key
   * @param defaultValue
   */
  public getPlatformItem(key: any, defaultValue?: any): any {
    return this.getItem(`${this.platformPrefix}.${key}`, defaultValue);
  }

  /**
   * 키경로에 설정된 값을 반환한다.
   *
   * @param name 키경로이름
   * @param  paramValue 키경로값
   * @param  forceOverride 기존값 덮어쓰기
   */
  public setItem(name: any, paramValue: any, forceOverride = false): any {
    const names: Array<any> = name.split(".");
    const configPath: any =
      1 === names.length
        ? this.config
        : this.recursiveMakePath(names, this.config);

    if (configPath[names[0]] && !forceOverride) {
      throw new Error(`duplicated. It already exists. ${name}`);
    }

    configPath[names[0]] = paramValue;
  }

  /**
   * 설정정보를 반환한다.
   *
   * @param key
   * @param defaultValue
   */
  public getItem(key: any, defaultValue?: any): any {
    const rtnValue: any = this.get(key);
    return ApplicationConfig.isNullOrUndefined(rtnValue)
      ? defaultValue
      : rtnValue;
  }

  public set(key: any, value: any): void {
    throw new UnsupportedOperationException("configuration is readonly...");
  }

  public get(key: any): any {
    let names: any;
    let rtnValue: any;

    try {
      names = key.split(".");
      rtnValue = this.recursiveFind(names, this.config);
    } catch (err) {
      if (console && console.error) {
        console.error(err);
      }
    }

    return rtnValue;
  }

  public remove(): void {
    throw new UnsupportedOperationException("configuration is readonly...");
  }

  public clear(): void {
    throw new UnsupportedOperationException("configuration is readonly...");
  }

  /**
   * 널 또는 언디파인 또는 공백 체크
   *
   * @param value 검증대상
   */
  private static isNullOrUndefined(value: any): boolean {
    return value === undefined || value === null;
  }

  /**
   * 이름목록을 순환하여 값을 추출 한다.
   *
   * @param names 이름목록
   * @param config 설정정보
   */
  private recursiveFind(names: Array<any>, config: any): any {
    let value = config[names.shift()];

    if (0 < names.length) {
      value = this.recursiveFind(names, value);
    }

    return value;
  }

  /**
   *
   * @param names
   * @param config
   */
  private recursiveMakePath(names: Array<any>, config: any): any {
    const name = names.shift();
    const lastName = name;
    let lastConfig = config;

    if (undefined === config[name]) {
      config[name] = {};
    }

    if (1 < names.length) {
      lastConfig = config[name];
      return this.recursiveMakePath(names, lastConfig);
    } else {
      return lastConfig[lastName];
    }
  }
}
