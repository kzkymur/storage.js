import Storage from "./storage";
export type Config = {
    name: string;
    storage?: Storage;
    separator?: string;
    keyValueSeparator?: string;
};
export declare const DefaultConfig: Required<Config>;
