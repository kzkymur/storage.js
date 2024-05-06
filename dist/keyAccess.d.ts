declare const joinKey: (separator: string) => (...args: string[]) => string;
declare const splitKey: (separator: string) => (key: string) => string[];
export type Join = ReturnType<typeof joinKey>;
export type Split = ReturnType<typeof splitKey>;
export declare const joinAndSplit: (separator: string) => {
    join: (...args: string[]) => string;
    split: (key: string) => string[];
};
export declare const getLayerKeys: (separator: string) => (...args: string[]) => string[];
export declare const normalizeLayeredKeys: (separator: string) => (layeredKeys: string[]) => string[];
export declare const isKeyValue: (target: string, keyValueSeparator: string) => boolean;
export declare const KeyValue: (target: string, keyValueSeparator: string) => {
    key: string;
    value: string;
};
export type KeyValue = ReturnType<typeof KeyValue>;
export declare const hasKeyValue: (target: any, kv: KeyValue) => boolean;
export declare enum Relation {
    none = "none",
    ancestor = "ancestor",
    itself = "itself",
    descendants = "descendants"
}
export declare const getRelation: (normalizedBasedKeys: string[], normalizedTargetKeys: string[]) => Relation;
export {};
