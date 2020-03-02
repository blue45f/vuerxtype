import VueI18n, { LocaleMessages } from "vue-i18n";
import { Exception } from "../exception/Exception";

class I18nProvider {
  private static INSTANCE: I18nProvider;

  private privateI18n!: VueI18n;

  public static getInstance(): I18nProvider {
    if (!I18nProvider.INSTANCE) {
      I18nProvider.INSTANCE = new I18nProvider();
    }
    return I18nProvider.INSTANCE;
  }

  public get i18n(): VueI18n {
    if (!this.privateI18n) {
      throw new Exception("Initialization failed. with initialization first.");
    }

    return this.privateI18n;
  }

  public trans(key: VueI18n.Path, values?: VueI18n.Values): string {
    return this.i18n.t(key, values) as string;
  }

  public initialize(
    messages: LocaleMessages,
    fallbackLocale = "en",
    locale?: string
  ) {
    this.privateI18n = new VueI18n({
      locale: locale,
      fallbackLocale: fallbackLocale,
      silentTranslationWarn: true,
      messages
    });
  }
}

export const i18nProvider = I18nProvider.getInstance();
