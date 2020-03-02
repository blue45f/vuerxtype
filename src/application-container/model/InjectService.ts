import { InjectScope } from "../../const/InjectScope";
import { interfaces } from "inversify/dts/interfaces/interfaces";

/**
 * Service Model
 */
export class InjectService {
  constructor(
    public name: string | symbol,
    public service: Class,
    public scope?: InjectScope,
    public handler?: (context: interfaces.Context, injectable: any) => any
  ) {}
}
