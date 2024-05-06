export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonPrimitive[] | JsonObject[];
export type JsonObject = {
    [key: string]: JsonPrimitive | JsonObject | JsonArray;
};
type Json = JsonPrimitive | JsonArray | JsonObject;
export default Json;
