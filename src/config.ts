import Storage from "./storage";

export type Config = {
  name: string;
  storage?: Storage;
  separator?: string;
  keyValueSeparator?: string;
};

export const DefaultConfig: Required<Config> = {
  name: "",
  storage: window.localStorage,
  separator: "-",
  keyValueSeparator: ":",
} as const;
