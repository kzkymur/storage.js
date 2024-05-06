import { Config } from "./config";
import { Join, Split } from "./keyAccess";
export default class StorageJsBase {
    protected config: Config;
    protected join: Join;
    protected split: Split;
    constructor(config?: Partial<Config>);
    protected get root(): any;
    protected set root(value: any);
}
