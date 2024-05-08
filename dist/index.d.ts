import { Config } from "./config";
import Json from "./json";
import { Handler, IsAffectedBy } from "./updateEventListener";
import Base from "./base";
export default class StorageJs extends Base {
    private eventListener;
    constructor(config: Config);
    get<T extends Json = Json>(layeredKey: string, ...layeredKeys: string[]): T[];
    set<T extends Json = Json>(value: T, layeredKey: string, ...layeredKeys: string[]): void;
    remove(layeredKey: string, ...layeredKeys: string[]): void;
    push<T extends Json = Json>(value: T, layeredKey: string, ...layeredKeys: string[]): void;
    clear(): void;
    addEventListener<T extends Json = Json>(layeredKey: string, handler: Handler<T>, isAffectedBy?: Partial<IsAffectedBy>): void;
    removeEventListener<T extends Json = Json>(layeredKey: string | undefined, handler: Handler<T> | undefined): void;
    concatLayeredKeys: (layeredKey: string, ...layeredKeys: string[]) => string;
    getAndSet: <T extends Json>(layeredKey: string, ...layeredKeys: string[]) => [() => T[], (newValue: T) => void];
    registerEventListener: <T extends Json = Json>(layeredKey: string, handler: Handler<T>, isAffectedBy?: Partial<IsAffectedBy>) => (() => void);
}
