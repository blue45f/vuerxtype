import RequireContext = __WebpackModuleApi.RequireContext;

export default class MockLoader {
  private readonly mockStore: RequireContext;

  constructor(store: RequireContext) {
    this.mockStore = store;
  }

  public getMockData(mockPath: string): any {
    let mockData: any = null;
    try {
      if ("true" === process.env.VUE_APP_MOCK_SERVICE) {
        mockData = this.mockStore(mockPath);
      }
    } catch (err) {
      if (
        console &&
        console.info &&
        "true" === process.env.VUE_APP_MOCK_SERVICE
      ) {
        console.info("Cannot loaded json file :: " + mockPath);
      }
    }

    return mockData;
  }
}
