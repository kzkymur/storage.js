import { Config, DefaultConfig } from "./config";
import { Join, Split, joinAndSplit } from "./keyAccess";

export default class StorageJsBase {
  protected config: Config;
  protected join: Join;
  protected split: Split;
  constructor(config?: Partial<Config>) {
    this.config = {
      ...DefaultConfig,
      ...config,
    };
    const { join, split } = joinAndSplit(this.config.separator);
    this.join = join;
    this.split = split;
  }

  protected get root() {
    const value = this.config.storage.getItem(this.config.name);
    if (value === null) {
      this.config.storage.setItem(this.config.name, JSON.stringify({}));
      return {};
    }
    return JSON.parse(value);
  }

  protected set root(value: any) {
    this.config.storage.setItem(this.config.name, JSON.stringify(value));
  }
}
