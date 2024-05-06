import { Config } from "./config";
import Json from "./json";
import { Handler, IsAffectedBy } from "./updateEventListener";
import Base from "./base";
export default class StorageJs extends Base {
    private eventListener;
    constructor(config?: Partial<Config>);
    get<T extends Json = Json>(...layeredKeys: string[]): T;
    set<T extends Json = Json>(value: T, ...layeredKeys: string[]): void;
    remove(...layeredKeys: string[]): void;
    push<T extends Json = Json>(value: T, ...layeredKeys: string[]): void;
    clear(): void;
    addEventListener<T extends Json = Json>(key: string, handler: Handler<T>, isAffectedBy?: Partial<IsAffectedBy>): void;
    removeEventListener<T extends Json = Json>(handler: Handler<T>): void;
}
