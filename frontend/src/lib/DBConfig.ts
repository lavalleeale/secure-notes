export const DBConfig = {
  name: "DB",
  version: 3,
  objectStoresMeta: [
    {
      store: "notes",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "title",
          keypath: "title",
          options: { unique: false },
        },
      ],
    },
    {
      store: "keys",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "key",
          keypath: "key",
          options: { unique: false },
        },
      ],
    },
  ],
};
