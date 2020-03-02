/**
 * It is the top-level interface for storing data.
 */
export interface Store {
  /**
   * add the store item
   *
   * @param key
   * @param value
   */
  set(key: any, value: any): void;

  /**
   * reading the store item
   *
   * @param key
   */
  get(key: any): any;

  /**
   * removing the store item
   *
   * @param key
   */
  remove(key: any): void;

  /**
   * clear all items
   */
  clear(): void;
}
