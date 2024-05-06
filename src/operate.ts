import Json, { JsonObject } from "./json";
import {
  KeyValue,
  hasKeyValue,
  isKeyValue,
  normalizeLayeredKeys,
} from "./keyAccess";
import { copy } from "./utils";

const recurrentAccess = (
  parent: Json,
  keyValueSeperator: string,
  normalizedLayeredKeys: string[]
): Json[] => {
  if (parent === undefined) return [];
  if (normalizedLayeredKeys.length === 0) return [parent];
  normalizedLayeredKeys = [...normalizedLayeredKeys];
  const key = normalizedLayeredKeys.shift() as string;

  if (Array.isArray(parent) && isKeyValue(key, keyValueSeperator)) {
    const kv = KeyValue(key, keyValueSeperator);
    return parent
      .filter((v) => hasKeyValue(v, kv))
      .map((child) =>
        recurrentAccess(child, keyValueSeperator, normalizedLayeredKeys)
      )
      .reduce((a, c) => [...a, ...c], []);
  } else {
    return recurrentAccess(
      (parent as any)[key],
      keyValueSeperator,
      normalizedLayeredKeys
    );
  }
};

export const access = (
  root: JsonObject,
  seperator: string,
  keyValueSeperator: string,
  layeredKeys: string[]
): Json[] => {
  if (layeredKeys.length === 0) return [root];
  layeredKeys = normalizeLayeredKeys(seperator)(layeredKeys);
  return recurrentAccess(root, keyValueSeperator, layeredKeys);
};

export const update = (
  value: Json,
  root: JsonObject,
  seperator: string,
  keyValueSeperator: string,
  layeredKeys: string[],
  indexInTarget?: number
) => {
  root = copy(root);
  layeredKeys = normalizeLayeredKeys(seperator)(layeredKeys);
  const lastKey = layeredKeys.pop() as string;
  const targets = access(root, seperator, keyValueSeperator, layeredKeys);
  targets.forEach((target, i) => {
    if (indexInTarget !== undefined && i !== indexInTarget) return;
    if (Array.isArray(target) && isKeyValue(lastKey, keyValueSeperator)) {
      const kv = KeyValue(lastKey, keyValueSeperator);
      target
        .map((v: Json) => hasKeyValue(v, kv))
        .forEach((isTarget, index) => {
          if (isTarget) (target as any)[index] = value;
        });
    } else {
      (target as any)[lastKey] = value;
    }
  });
  return root;
};

export const remove = (
  root: JsonObject,
  seperator: string,
  keyValueSeperator: string,
  layeredKeys: string[]
) => {
  root = copy(root);
  layeredKeys = normalizeLayeredKeys(seperator)(layeredKeys);
  const lastKey = layeredKeys.pop() as string;
  const targets = access(root, seperator, keyValueSeperator, layeredKeys);
  targets.forEach((target) => {
    if (Array.isArray(target) && isKeyValue(lastKey, keyValueSeperator)) {
      const kv = KeyValue(lastKey, keyValueSeperator);
      target
        .map((v: Json) => hasKeyValue(v, kv))
        .forEach((isTarget, index) => {
          if (isTarget) delete target[index];
        });
    } else {
      delete (target as any)[lastKey];
    }
  });
  const parents = access(root, seperator, keyValueSeperator, layeredKeys);
  parents.forEach((parent, index) => {
    if (Array.isArray(parent)) {
      root = update(
        parent.filter((v) => v) as any,
        root,
        seperator,
        keyValueSeperator,
        layeredKeys,
        index
      );
    }
  });
  return root;
};

export const push = (
  value: Json,
  root: JsonObject,
  seperator: string,
  keyValueSeperator: string,
  layeredKeys: string[]
) => {
  root = copy(root);
  layeredKeys = normalizeLayeredKeys(seperator)(layeredKeys);
  const targets = access(root, seperator, keyValueSeperator, layeredKeys);
  targets.forEach((target, index) => {
    if (Array.isArray(target)) {
      root = update(
        [...target, value] as Json,
        root,
        seperator,
        keyValueSeperator,
        layeredKeys,
        index
      );
    }
  });
  return root;
};
