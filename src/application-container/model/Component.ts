/**
 * Component Model
 */
export class Component {
  constructor(public name: string | symbol, public component: Class) {}

  /**
   * return created object
   *
   * @param src
   */
  public static create(src: Component): Component {
    return new Component(src.name, src.component);
  }
}
