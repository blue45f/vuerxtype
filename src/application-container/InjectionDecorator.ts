import { injectable, interfaces } from "inversify";
import { NotImplementedException } from "../exception/NotImplementedException";

/**
 * Decoration Inject Class
 */
@injectable()
export default abstract class InjectionDecorator {
  /* tslint:disable */
  public static intercept(context: interfaces.Context, injectable: any): any {
    throw new NotImplementedException();
  }
}
