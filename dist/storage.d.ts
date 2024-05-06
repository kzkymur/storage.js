export interface BaseStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
type Storage = typeof window.localStorage | typeof window.sessionStorage | BaseStorage;
export default Storage;
