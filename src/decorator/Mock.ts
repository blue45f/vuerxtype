import { applicationContext } from "../application-container/ApplicationContext";
import { Observable } from "rxjs";
import { EnvType } from "../const/EnvType";

/**
 * MOCK 사용여부를 반환한다.
 * 1. 구동환경이 운영일때는 무조건 real로 true로 반환한다.
 * 2. 글로벌 MOCK사용여부가 true가 아니면 무조건 true로 반환한다.
 * 3. 해당 호출에 대해서 MOCK 사용여부를 체크하여 여부를 반환한다.
 *
 * @param env 구동환경
 * @param isMockByGlobal 전역 MOCK 사용여부
 * @param isMockByThis 해당호출에대한 MOCK 사용여부
 */
const isMock = (
  env: string,
  isMockByGlobal: string,
  isMockByThis: boolean
): boolean => {
  let isMock: boolean;

  if (EnvType.production === env) {
    isMock = false;
  } else if ("true" !== isMockByGlobal) {
    isMock = false;
  } else {
    isMock = isMockByThis;
  }

  return isMock;
};

export const mapperMock = (type: string, returnMock: boolean) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const PRE_FIX = "./";
  const POST_FIX = ".json";

  if (
    isMock(process.env.NODE_ENV, process.env.VUE_APP_MOCK_SERVICE, returnMock)
  ) {
    descriptor.value = (...args: []) => {
      return new Observable((observer: any) => {
        if (applicationContext.getMockLoader === undefined) {
          observer.error("MockLoader is not set on ApplicationManager.");
        } else {
          observer.next(
            applicationContext.getMockLoader.getMockData(
              PRE_FIX + type + POST_FIX
            )
          );
        }
      });
    };
  } else {
    return;
  }
};
