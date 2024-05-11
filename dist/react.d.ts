import Json from "./json";
import StorageJs from "./index";
export declare const useStorage: <T extends Json>(storage: StorageJs, key: string, defaultValue?: T) => [T[], (v: T) => void];
type MaybeUndefined<T, Value> = Value extends T ? T : T | undefined;
export declare const useStorageUnique: <T extends Json>(storage: StorageJs, key: string, defaultValue?: T) => [MaybeUndefined<T, T>, (v: T) => void];
export default useStorage;
