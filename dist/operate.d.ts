import Json, { JsonObject } from "./json";
export declare const access: (root: JsonObject, seperator: string, keyValueSeperator: string, layeredKeys: string[]) => Json[];
export declare const update: (value: Json, root: JsonObject, seperator: string, keyValueSeperator: string, layeredKeys: string[], indexInTarget?: number) => JsonObject;
export declare const remove: (root: JsonObject, seperator: string, keyValueSeperator: string, layeredKeys: string[]) => JsonObject;
export declare const push: (value: Json, root: JsonObject, seperator: string, keyValueSeperator: string, layeredKeys: string[]) => JsonObject;
