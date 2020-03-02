export interface LocaleResourceLoader<T> {
  localeMessages: T;

  /**
   * path에 있는 모든 리소스를 적재한다.
   *
   * @param path
   */
  loadAll<A>(path: string): T;

  /**
   * 전달된 리소스를 공통 리소스와 함께 적재한다.
   *
   * @param resource
   */
  mergeAll(resource: T): T;

  /**
   * 파일 리소스를 적재한다.
   *
   * @param fileName
   */
  load(fileName: string): T;
}
