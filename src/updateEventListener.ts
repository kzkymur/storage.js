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
  private seperator: string;
  private keyValueSeperator: string;
  private split: Split;
  constructor(seperator: string, keyValueSeperator: string) {
    this.seperator = seperator;
    this.keyValueSeperator = keyValueSeperator;
    const { split } = joinAndSplit(seperator);
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

  remove = (handler: Handler) => {
    this.handlerWrappers = this.handlerWrappers.filter(
      (hw) => hw.handler !== handler
    );
  };

  exec = (layerKey: string, newRoot: JsonObject) => {
    const layeredKeys = normalizeLayeredKeys(this.seperator)([layerKey]);
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
          this.seperator,
          this.keyValueSeperator,
          hwLayeredKeys
        );
        newValues.forEach((v) => hw.handler(v));
      }
    });
  };
}
