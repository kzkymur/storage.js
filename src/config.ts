import Storage from "./storage";

export type Config = {
  storage: Storage;
  separator: string;
  keyValueSeparator: string;
  name: string;
};

export const DefaultConfig: Config = {
  storage: window.localStorage,
  separator: "-",
  keyValueSeparator: ":",
  name: "",
} as const;
