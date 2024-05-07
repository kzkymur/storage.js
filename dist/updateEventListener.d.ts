import Json, { JsonObject } from "./json";
export type Handler<T extends Json = Json> = (v: T) => void;
export type IsAffectedBy = {
    parent: boolean;
    children: boolean;
};
export default class EventListener {
    private handlerWrappers;
    private separator;
    private keyValueSeparator;
    private split;
    constructor(separator: string, keyValueSeparator: string);
    add: (key: string, handler: Handler, isAffectedBy?: Partial<IsAffectedBy>) => void;
    remove: (layeredKey: string | undefined, handler: Handler | undefined) => void;
    exec: (layerKey: string, newRoot: JsonObject) => void;
}
