import Storage from "./storage";
export type Config = {
    storage: Storage;
    separator: string;
    keyValueSeparator: string;
    name: string;
};
export declare const DefaultConfig: Config;
