import Json, { JsonObject } from "./json";
import {
  Relation,
  Split,
  getRelation,
  joinAndSplit,
  normalizeLayeredKeys,
} from "./keyAccess";
import { access } from "./operate";

export type Handler<T extends Json = Json> = (v: T) => void;
export type IsAffectedBy = {
  parent: boolean;
  children: boolean;
};
const DefaultIsAffectedBy: IsAffectedBy = {
  parent: false,
  children: false,
};
type HandlerWrapper<T extends Json = Json> = {
  key: string;
  handler: Handler<T>;
  isAffectedBy: IsAffectedBy;
};

export default class EventListener {
  private handlerWrappers: HandlerWrapper[] = [];
  private separator: string;
  private keyValueSeparator: string;
  private split: Split;
  constructor(separator: string, keyValueSeparator: string) {
    this.separator = separator;
    this.keyValueSeparator = keyValueSeparator;
    const { split } = joinAndSplit(separator);
    this.split = split;
  }

  add = (
    key: string,
    handler: Handler,
    isAffectedBy?: Partial<IsAffectedBy>
  ) => {
    this.handlerWrappers = [
      ...this.handlerWrappers,
      {
        key,
        handler,
        isAffectedBy: {
          ...DefaultIsAffectedBy,
          ...isAffectedBy,
        },
      },
    ];
    this.handlerWrappers.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      } else if (a.key < b.key) {
        return -1;
      }
      return 0;
    });
  };

  remove = (layeredKey: string | undefined, handler: Handler | undefined) => {
    const params = { key: layeredKey, handler };
    const validParams = Object.entries(params)
      .filter((v) => v[1])
      .map((v) => v[0]) as Array<keyof typeof params>;
    this.handlerWrappers = this.handlerWrappers.filter((hw) =>
      validParams.reduce<boolean>((a, c) => a || hw[c] !== params[c], false)
    );
  };

  exec = (layerKey: string, newRoot: JsonObject) => {
    const layeredKeys = normalizeLayeredKeys(this.separator)([layerKey]);
    this.handlerWrappers.forEach((hw) => {
      const hwLayeredKeys = this.split(hw.key);
      const relation = getRelation(layeredKeys, hwLayeredKeys);
      if (
        relation === Relation.itself ||
        (relation === Relation.ancestor && hw.isAffectedBy.children) ||
        (relation === Relation.descendants && hw.isAffectedBy.parent)
      ) {
        const newValues = access(
          newRoot,
          this.separator,
          this.keyValueSeparator,
          hwLayeredKeys
        );
        newValues.forEach((v) => hw.handler(v));
      }
    });
  };
}
