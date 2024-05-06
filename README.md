# @kzkymur/storage

This is a super lightweight library to handle WebStorage more easily.

## What you can do

- To access flexibly to WebStorage with JSON structure and Layered-String-Key
- To register event listener with Layered-String-Key

## What is Layered-String-Key?

- Layered-String-Key is a very simple way to access object or primitive in JSON.
- Layered-String-Key is composed with Separotor and KeyValueSeparotor

- For example, you have a JSON object like this

```json
{
  "users": [
    {
      "id": 1,
      "name": "kzkymur",
      "job": "student"
    },
    {
      "id": 2,
      "name": "ringring",
      "job": "student"
    }
  ]
}
```

and '-' Separotor, ':' KeyValueSeparotor.

- if you wanna get a user's name id = 1, Layered-String-Key will be `users-id:1-name`

## How to use

Assume that your localStorage is registered with the previous example JSON.

```js
import StorageJs from "@kzkymur/storage";

const storage = new StorageJs({
  storage: winodw.localStorage || window.sessionStorage, // or your original instance implement localStorage interface
  name: "test",

  // These are optional. A comlex value will be better if you set.
  Separotor: "-",
  keyValueSeparator: ":",
});

// get method
const [name] = storage.get("users", "id:1", "name");
const [nameByJoinedStringKey] = storage.get("users-id:1-name");
const [nameByIndex] = storage.get("users-id:1-name");
console.log(name); // "kzkymur".
console.log(name === nameByJoinedStringKey); // true.
console.log(name === nameByIndex); // true.
console.log(storage.get("users-job:student-name")); // ['kzkymur', 'ringring']

// set method
storage.set("kzkymur2", "users", "0", "name");
console.log(storage.get("users", "id:1", "name")[0]); // "kzkymur2"
storage.set("teacher", "users-job:student-job");
console.log(storage.get("users-job:teacher-name")); // ['kzkymur', 'ringring']

// remove method
storage.remove("users", "0");
console.log(storage.get("users", "id:1")); // []

// eventListener
const handler = console.log;
storage.addEventListener("users-id:1", handler, {
  parent: false,
  children: true,
});
storage.set("kzkymur2", "users", "id:1", "name"); // console.log({ id: 1, name: "kzkymur2" }); is fired
storage.removeEventListener(handler);
```

more information is written in `test/index.test.ts` so plz refer to it.

## Install

```sh
npm i @kzkymur/storage
```

## Future work

- Type Gaured
- A way to set root value
- Increasing the number of test case and examples

## Author's comment

I'll be happy if you contribute this!

