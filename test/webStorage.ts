import { BaseStorage } from "storage-js/storage";

export default class WebStorage implements BaseStorage {
  store: {} = {};
  setItem = (key: string, value: string) => {
    this.store[key] = value;
  };
  removeItem = (key: string) => {
    delete this.store[key];
  };
  getItem = (key: string) => {
    return this.store[key] || null;
  };
}
