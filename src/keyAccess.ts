import { lastOne } from "./utils";

const joinKey =
  (seperator: string) =>
  (...args: string[]): string =>
    args.join(seperator);

const splitKey =
  (seperator: string) =>
  (key: string): string[] =>
    key.split(seperator);

export type Join = ReturnType<typeof joinKey>;
export type Split = ReturnType<typeof splitKey>;

export const joinAndSplit = (seperator: string) => ({
  join: joinKey(seperator),
  split: splitKey(seperator),
});

export const getLayerKeys =
  (seperator: string) =>
  (...args: string[]) => {
    const { join, split } = joinAndSplit(seperator);
    return split(join(...args)).reduce<string[]>(
      (a, c) => [...a, join(lastOne(a), c)],
      []
    );
  };

export const normalizeLayeredKeys =
  (seperator: string) => (layeredKeys: string[]) => {
    const { join, split } = joinAndSplit(seperator);
    return split(join(...layeredKeys));
  };

export const isKeyValue = (target: string, keyValueSeperator: string) => {
  return target.split(keyValueSeperator).length === 2;
};
export const KeyValue = (target: string, keyValueSeperator: string) => {
  const splited = target.split(keyValueSeperator);
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
  if (normalizedBasedKeys.length === normalizedTargetKeys.length) return Relation.itself;
  return Relation.descendants;
};
