import { Config } from "./config";
import { access, push, remove, update } from "./operate";
import Json from "./json";
import EventListener, { Handler, IsAffectedBy } from "./updateEventListener";
import Base from "./base";

export default class StorageJs extends Base {
  private eventListener: EventListener;
  constructor(config?: Partial<Config>) {
    super(config);
    this.eventListener = new EventListener(
      this.config.separator,
      this.config.keyValueSeparator
    );
  }

  get<T extends Json = Json>(...layeredKeys: string[]) {
    return access(
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      layeredKeys
    ) as T;
  }

  set<T extends Json = Json>(value: T, ...layeredKeys: string[]) {
    this.root = update(
      value as Json,
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      layeredKeys
    );
    this.eventListener.exec(this.join(...layeredKeys), this.root);
  }

  remove(...layeredKeys: string[]) {
    this.root = remove(
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      layeredKeys
    );
    this.eventListener.exec(this.join(...layeredKeys), this.root);
  }

  push<T extends Json = Json>(value: T, ...layeredKeys: string[]) {
    this.root = push(
      value,
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      layeredKeys
    );
    this.eventListener.exec(this.join(...layeredKeys), this.root);
  }

  clear() {
    this.config.storage.removeItem(this.config.name);
  }

  addEventListener<T extends Json = Json>(
    key: string,
    handler: Handler<T>,
    isAffectedBy?: Partial<IsAffectedBy>
  ) {
    this.eventListener.add(key, handler, isAffectedBy);
  }

  removeEventListener<T extends Json = Json>(handler: Handler<T>) {
    this.eventListener.remove(handler);
  }
}
