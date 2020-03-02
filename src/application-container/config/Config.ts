import { Store } from "../Store";

/**
 * Configuration Interface
 */
export interface Config extends Store {
  /**
   * return after hook load config
   */
  init(): Promise<any>;

  /**
   * return Environment Type
   */
  getEnvType(): string;

  /**
   * return operating(run) type
   */
  getRunType(): string;

  /**
   * return Platform Type
   */
  getPlatformType(): string;

  /**
   * return item by Environment config name
   *
   * @param {any} key
   * @param {any} defaultValue
   */
  getEnvItem(key: any, defaultValue?: any): any;

  /**
   * return item by Platform config name
   *
   * @param key
   * @param defaultValue
   */
  getPlatformItem(key: any, defaultValue?: any): any;

  /**
   * return item by config name
   *
   * @param key
   * @param defaultValue
   */
  getItem(key: any, defaultValue?: any): any;

  /**
   * setting item by config
   *
   * @param {any} name
   * @param {any} paramValue
   * @param {boolean} forceOverride
   */
  setItem(name: any, paramValue: any, forceOverride?: boolean): any;
}
