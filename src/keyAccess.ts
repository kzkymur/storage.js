import { lastOne } from "./utils";

const joinKey =
  (separator: string) =>
  (...args: string[]): string =>
    args.join(separator);

const splitKey =
  (separator: string) =>
  (key: string): string[] =>
    key.split(separator);

export type Join = ReturnType<typeof joinKey>;
export type Split = ReturnType<typeof splitKey>;

export const joinAndSplit = (separator: string) => ({
  join: joinKey(separator),
  split: splitKey(separator),
});

export const getLayerKeys =
  (separator: string) =>
  (...args: string[]) => {
    const { join, split } = joinAndSplit(separator);
    return split(join(...args)).reduce<string[]>(
      (a, c) => [...a, join(lastOne(a), c)],
      []
    );
  };

export const normalizeLayeredKeys =
  (separator: string) => (layeredKeys: string[]) => {
    const { join, split } = joinAndSplit(separator);
    return split(join(...layeredKeys));
  };

export const isKeyValue = (target: string, keyValueSeparator: string) => {
  return target.split(keyValueSeparator).length === 2;
};
export const KeyValue = (target: string, keyValueSeparator: string) => {
  const splited = target.split(keyValueSeparator);
  return { key: splited[0], value: splited[1] };
};
export type KeyValue = ReturnType<typeof KeyValue>;

export const hasKeyValue = (target: any, kv: KeyValue): boolean =>
  (typeof target[kv.key] == "string"
    ? target[kv.key]
    : JSON.stringify(target[kv.key])) === kv.value;

export enum Relation {
  none = "none",
  ancestor = "ancestor",
  itself = "itself",
  descendants = "descendants",
}
export const getRelation = (
  normalizedBasedKeys: string[],
  normalizedTargetKeys: string[]
): Relation => {
  for (let i = 0; i < normalizedBasedKeys.length; i++) {
    if (normalizedTargetKeys[i] === undefined) return Relation.ancestor;
    if (normalizedBasedKeys[i] !== normalizedBasedKeys[i]) return Relation.none;
  }
  if (normalizedBasedKeys.length === normalizedTargetKeys.length)
    return Relation.itself;
  return Relation.descendants;
};
