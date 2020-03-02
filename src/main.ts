import "reflect-metadata";

import { SERVICES } from "./const/Services";
import { ApplicationManager } from "../src/application-container/ApplicationManager";
import { App } from "./App";

new ApplicationManager([], App)
  .setService([...SERVICES])
  .setMockLoader(
    require.context(
      // MOCK파일이 있는 ROOT 폴더
      "../mocks",
      // 하위 폴더까지 포함할 지 여부
      true,
      // MOCK파일을 찾는데 사용할 정규표현식
      /\.json$/
    )
  )
  .bootstrap("#app");
