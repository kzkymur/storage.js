import { useState, useMemo, useCallback, useEffect } from "react";
import Json from "./json";
import StorageJs from ".";

const useCounter = (): [number, () => void] => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(count + 1), [count]);
  return [count, increment];
};

export const useStorage = <T extends Json>(
  storage: StorageJs,
  key: string,
  defaultValue?: T
): [T[], (v: T) => void] => {
  const [count, increment] = useCounter();
  const [get, set] = useMemo(() => storage.getAndSet<T>(key), [key]);

  useEffect(() => {
    if (get().length === 0 && defaultValue !== undefined) set(defaultValue);
  }, [get, set, defaultValue]);

  useEffect(() => {
    const unregister = storage.registerEventListener(key, increment);
    return unregister;
  }, [increment, key]);

  const value = useMemo<T[]>(get, [count]);
  return [value, set];
};

type MaybeUndefined<T, Value> = Value extends T ? T : T | undefined;
export const useStorageUnique = <T extends Json>(
  storage: StorageJs,
  key: string,
  defaultValue?: T
): [MaybeUndefined<T, typeof defaultValue>, (v: T) => void] => {
  const [value, set] = useStorage<T>(storage, key, defaultValue);
  return [value[0], set];
};

export default useStorage;
