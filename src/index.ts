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

  get<T extends Json = Json>(layeredKey: string, ...layeredKeys: string[]) {
    return access(
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      [layeredKey, ...layeredKeys]
    ) as T[];
  }

  set<T extends Json = Json>(
    value: T,
    layeredKey: string,
    ...layeredKeys: string[]
  ) {
    this.root = update(
      value as Json,
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      [layeredKey, ...layeredKeys]
    );
    this.eventListener.exec(this.join(layeredKey, ...layeredKeys), this.root);
  }

  remove(layeredKey: string, ...layeredKeys: string[]) {
    this.root = remove(
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      [layeredKey, ...layeredKeys]
    );
    this.eventListener.exec(this.join(layeredKey, ...layeredKeys), this.root);
  }

  push<T extends Json = Json>(
    value: T,
    layeredKey: string,
    ...layeredKeys: string[]
  ) {
    this.root = push(
      value,
      this.root,
      this.config.separator,
      this.config.keyValueSeparator,
      [layeredKey, ...layeredKeys]
    );
    this.eventListener.exec(this.join(layeredKey, ...layeredKeys), this.root);
  }

  clear() {
    this.config.storage.removeItem(this.config.name);
  }

  addEventListener<T extends Json = Json>(
    layeredKey: string,
    handler: Handler<T>,
    isAffectedBy?: Partial<IsAffectedBy>
  ) {
    this.eventListener.add(layeredKey, handler, isAffectedBy);
  }

  removeEventListener<T extends Json = Json>(
    layeredKey: string | undefined,
    handler: Handler<T> | undefined
  ) {
    this.eventListener.remove(layeredKey, handler);
  }

  // utilities
  concatLayeredKeys = (layeredKey: string, ...layeredKeys: string[]) =>
    this.join(layeredKey, ...layeredKeys);

  getAndSet = <T extends Json>(
    layeredKey: string,
    ...layeredKeys: string[]
  ): [() => T[], (newValue: T) => void] => [
    () => this.get<T>(layeredKey, ...layeredKeys),
    (newValue: T) => this.set<T>(newValue, layeredKey, ...layeredKeys),
  ];

  registerEventListener = <T extends Json = Json>(
    layeredKey: string,
    handler: Handler<T>,
    isAffectedBy?: Partial<IsAffectedBy>
  ): (() => void) => {
    this.addEventListener(layeredKey, handler, isAffectedBy);
    const unregister = () => this.removeEventListener(layeredKey, handler);
    return unregister;
  };
}
