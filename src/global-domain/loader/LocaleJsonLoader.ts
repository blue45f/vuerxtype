import { LocaleMessages } from "vue-i18n";
import { injectable } from "inversify";
import merge from "deepmerge";
import { ko } from "../../locales";
import { UnsupportedOperationException } from "../../exception/UnsupportedOperationException";
import { LocaleResourceLoader } from "./LocaleResourceLoader";

@injectable()
export class LocaleJsonLoader implements LocaleResourceLoader<LocaleMessages> {
  private messages: LocaleMessages = {};

  private readonly JSON_FILE_PATTERN: RegExp = /[A-Za-z0-9-_,\s]+\.json$/i;

  public get localeMessages(): LocaleMessages {
    return this.messages;
  }

  public loadAll(path: string): LocaleMessages {
    this.messages = merge(
      this.loadI18nForCoreMessages(),
      this.loadi18nForApplicationMessages(path)
    );
    return this.messages;
  }

  public mergeAll(resource: LocaleMessages): LocaleMessages {
    this.messages = merge(this.loadI18nForCoreMessages(), resource);
    return this.messages;
  }

  /**
   * JsonLoader의 단건 파일 적재는 필요시 구현한다.
   */
  public load(): LocaleMessages {
    throw new UnsupportedOperationException(
      "There is no requirement. Implement as needed"
    );
  }

  private loadI18nForCoreMessages(): LocaleMessages {
    return {
      ko
    };
  }

  private loadi18nForApplicationMessages(path: string): LocaleMessages {
    throw new UnsupportedOperationException(
      "There is no requirement. Implement as needed"
    );
  }
}
