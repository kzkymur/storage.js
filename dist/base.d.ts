import { Config } from "./config";
import { JsonObject } from "./json";
import { Join, Split } from "./keyAccess";
export default class StorageJsBase {
    protected config: Config;
    protected join: Join;
    protected split: Split;
    constructor(config?: Partial<Config>);
    protected get root(): JsonObject | undefined;
    protected set root(value: JsonObject | undefined);
}
