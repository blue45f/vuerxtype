/**
 * Module Model
 */
import { Component } from "./Component";
import { InjectService } from "./InjectService";

export class Module {
  constructor(
    public name: string | symbol,
    public module: Class,
    public components: Array<Component> = [],
    public services: Array<InjectService> = []
  ) {}

  /**
   * return created object
   *
   * @param {Module} src original object
   * @returns {Module} created object
   */
  public static create(src: Module): Module {
    return new Module(
      src.name,
      src.module,
      src.components
        ? src.components.map((value: Component) => Component.create(value))
        : [],
      src.services ? src.services : []
    );
  }
}
