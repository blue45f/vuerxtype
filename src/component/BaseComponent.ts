import { Observable, Subscription } from "rxjs";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { i18nProvider } from "../global-domain/I18nProvider";
import VueI18n from "vue-i18n";

@Component
export class BaseComponent extends Vue {
  protected subscription: Subscription = new Subscription();
  private $trans!: OmitThisParameter<
    (key: VueI18n.Path, values?: VueI18n.Values) => string
  >;

  protected created() {
    // extend Vue add i18n trans adapter to the global.
    this.$trans = i18nProvider.trans.bind(this);
  }

  protected destroyed() {
    this.subscription.unsubscribe();
  }

  protected subscribe<T>(
    observable: Observable<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.addSubscription(observable.subscribe(next, error, complete));
  }

  private addSubscription(subscription: Subscription): Subscription {
    return this.subscription.add(subscription);
  }
}
