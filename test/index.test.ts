import StorageJs from "storage-js";
import * as mock from "./mock.json";
import WebStorage from "./webStorage";

const toBeStr = (a: any, b: any) =>
  expect(JSON.stringify(a)).toBe(JSON.stringify(b));

const getInitStorage = () => {
  const webStorage = new WebStorage();
  webStorage.setItem("jest", JSON.stringify(mock));
  const storage = new StorageJs({
    storage: webStorage,
    name: "jest",
  });
  return storage;
};

describe("test get method", () => {
  test("get primitive", () => {
    const storage = getInitStorage();
    toBeStr(
      storage.get("users", "id:1", "name"),
      mock.users.filter((u) => u.id === 1).map((u) => u.name)
    );
    toBeStr(
      storage.get("users-name:kzkymur-name"),
      mock.users.filter((u) => u.id === 1).map((u) => u.name)
    );
  });

  test("get obj by index", () => {
    const storage = getInitStorage();
    toBeStr(storage.get("users", "1"), [mock.users[1]]);
  });

  test("get obj by property", () => {
    const storage = getInitStorage();
    toBeStr(
      storage.get("users", "id:1"),
      mock.users.filter((u) => u.id === 1)
    );
  });

  test("get value in matrix", () => {
    const storage = getInitStorage();
    toBeStr(storage.get("matrix", "1", "1"), [mock.matrix[1][1]]);
    toBeStr(storage.get("matrix-1-1"), [mock.matrix[1][1]]);
  });

  test("get matrix", () => {
    const storage = getInitStorage();
    toBeStr(storage.get("matrix"), [mock.matrix]);
  });

  test("get items in one time", () => {
    const storage = getInitStorage();
    toBeStr(
      storage.get("items", "owner:1"),
      mock.items.filter((i) => i.owner === 1)
    );
  });

  test("get by key value that value is string", () => {
    const storage = getInitStorage();
    toBeStr(
      storage.get("items", "name:sord"),
      mock.items.filter((i) => i.name === "sord")
    );
  });
});

describe("test set method", () => {
  test("set primitive", () => {
    const storage = getInitStorage();
    storage.set("kzkymur2", "users", "id:1", "name");
    toBeStr(storage.get("users", "id:1", "name"), ["kzkymur2"]);
  });

  test("set obj by index", () => {
    const storage = getInitStorage();
    const newUser = { id: 3, name: "ta1ch" };
    storage.set(newUser, "users", "0");
    toBeStr(storage.get("users", "0"), [newUser]);
  });

  test("set obj by property", () => {
    const storage = getInitStorage();
    const newUser = { id: 3, name: "ta1ch" };
    storage.set(newUser, "users", "id:1");
    toBeStr(storage.get("users", "id:3"), [newUser]);
    toBeStr(storage.get("users", "id:1"), []);
  });

  test("set object array", () => {
    const storage = getInitStorage();
    const newUsers = [
      { id: 3, name: "ta1ch" },
      { id: 4, name: "poco" },
    ];
    storage.set(newUsers, "users");
    toBeStr(storage.get("users"), [newUsers]);
  });

  test("set value in matrix", () => {
    const storage = getInitStorage();
    storage.set(44, "matrix", "1", "1");
    toBeStr(storage.get("matrix", "1", "1"), [44]);
  });

  test("set array in matrix", () => {
    const storage = getInitStorage();
    const [get, set] = storage.getAndSet("matrix", "1");
    set([44, 55, 66]);
    toBeStr(get(), [[44, 55, 66]]);
  });

  test("set items in one time", () => {
    const storage = getInitStorage();
    storage.set(3, "items", "owner:1", "owner");
    toBeStr(storage.get("items", "owner:1"), []);
    toBeStr(
      storage.get("items", "owner:3"),
      mock.items.filter((i) => i.owner === 1).map((i) => ({ ...i, owner: 3 }))
    );
  });

  test("set by key value that value is string", () => {
    const storage = getInitStorage();
    storage.set("supersord", "items-name:sord-name");
    toBeStr(storage.get("items-name:sord"), []);
    toBeStr(
      storage.get("items-name:supersord-id"),
      mock.items.filter((i) => i.name === "sord").map((i) => i.id)
    );
  });
});

describe("test remove method", () => {
  test("remove primitive", () => {
    const storage = getInitStorage();
    storage.remove("users", "id:1", "name");
    toBeStr(storage.get("users", "id:1", "name"), []);
  });

  test("remove obj by index", () => {
    const storage = getInitStorage();
    const users = storage.get("users")[0] as any;
    storage.remove("users", "1");
    users.splice(1, 1);
    toBeStr(storage.get("users"), [users]);
  });

  test("remove obj by property", () => {
    const storage = getInitStorage();
    storage.remove("users", "id:1");
    toBeStr(storage.get("users", "id:1"), []);
  });

  test("remove items in one time", () => {
    const storage = getInitStorage();
    storage.remove("items", "owner:1");
    toBeStr(storage.get("items", "owner:1"), []);
    toBeStr(storage.get("items"), [mock.items.filter((i) => i.owner !== 1)]);
  });
});

describe("test push method", () => {
  test("push primitive", () => {
    const storage = getInitStorage();
    storage.push(4, "matrix", "0");
    toBeStr(storage.get("matrix", "0"), [[1, 2, 3, 4]]);
  });

  test("push obj", () => {
    const storage = getInitStorage();
    const newItem = { id: 4, name: "shield", owner: 2 };
    storage.push(newItem, "items");
    toBeStr(storage.get("items", "3"), [newItem]);
    toBeStr(storage.get("items"), [[...mock.items, newItem]]);
  });

  test("push row to matrix", () => {
    const storage = getInitStorage();
    const row = [1111, 2222, 3333];
    storage.push(row, "matrix");
    toBeStr(storage.get("matrix", "3"), [row]);
    toBeStr(storage.get("matrix"), [[...mock.matrix, row]]);
  });
});

describe("test clear method", () => {
  test("clear", () => {
    const storage = getInitStorage();
    toBeStr(storage.get("users"), [mock.users]);
    storage.clear();
    toBeStr(storage.get("users"), []);
  });
});

describe("test event listener", () => {
  test("primitive", () => {
    const storage = getInitStorage();
    const handler = jest.fn();

    // add test
    storage.addEventListener("users-id:1-name", handler);
    storage.set("kzkymur2", "users-id:1-name");
    expect(handler).toHaveBeenCalledWith("kzkymur2");
    expect(handler).toHaveBeenCalledTimes(1);

    // not affected by parent
    storage.set(
      {
        id: 1,
        name: "kzkymru3",
      },
      "users-id:1"
    );
    expect(handler).toHaveBeenCalledTimes(1);

    // remove test
    storage.removeEventListener("users-id:1", handler);
    storage.set("kzkymur4", "users-id:1-name");
    expect(handler).toHaveBeenCalledTimes(2);
    storage.removeEventListener("users-id:1-name", handler);
    storage.set("kzkymur5", "users-id:1-name");
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("object", () => {
    const storage = getInitStorage();
    const handler = jest.fn();
    const newUser = { id: 1, name: "kzkymur2" };

    // add test
    storage.addEventListener("users-id:1", handler);
    storage.set(newUser, "users", "id:1");
    expect(handler).toHaveBeenCalledWith(newUser);
    expect(handler).toHaveBeenCalledTimes(1);

    // not affected by children
    storage.set("kzkymru3", "users-id:1-name");
    expect(handler).toHaveBeenCalledTimes(1);

    // remove test
    storage.removeEventListener(undefined, handler);
    storage.set(
      {
        id: 1,
        name: "kzkymur4",
      },
      "users-id:1"
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("affected by parent", () => {
    const storage = getInitStorage();
    const handler = jest.fn();

    const unregister = storage.registerEventListener(
      "users-id:1-name",
      handler,
      { parent: true }
    );
    storage.set("kzkymur2", storage.concatLayeredKeys("users", "id:1", "name"));
    expect(handler).toHaveBeenCalledWith("kzkymur2");
    expect(handler).toHaveBeenCalledTimes(1);

    storage.set(
      {
        id: 1,
        name: "kzkymur3",
      },
      "users-id:1"
    );
    expect(handler).toHaveBeenLastCalledWith("kzkymur3");
    expect(handler).toHaveBeenCalledTimes(2);

    unregister();
    storage.set(
      {
        id: 1,
        name: "kzkymur4",
      },
      "users-id:1"
    );
    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("affected by children", () => {
    const storage = getInitStorage();
    const handler = jest.fn();

    // child test
    storage.addEventListener("matrix", handler, { children: true });
    storage.set([44, 55, 66], "matrix-1");
    const copiedMatrix = [...mock.matrix];
    copiedMatrix[1] = [44, 55, 66];
    expect(handler).toHaveBeenCalledWith(copiedMatrix);
    expect(handler).toHaveBeenCalledTimes(1);

    // grandChild test
    storage.set(77, "matrix-1-1");
    copiedMatrix[1][1] = 77;
    expect(handler).toHaveBeenCalledWith(copiedMatrix);
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
