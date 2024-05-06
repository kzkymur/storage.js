import Storage from "./storage";

export type Config = {
  storage: Storage;
  seperator: string;
  keyValueSeperator: string;
  name: string;
};

export const DefaultConfig: Config = {
  storage: window.localStorage,
  seperator: "-",
  keyValueSeperator: ":",
  name: "",
} as const;
