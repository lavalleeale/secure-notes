import * as React from "react";

export const KeyContext = React.createContext<{
  key: CryptoKey | undefined;
  setKey(key: CryptoKey): void;
  needKey: boolean;
  setNeedKey(value: boolean): void;
}>({
  key: undefined,
  setKey: () => {},
  needKey: false,
  setNeedKey: () => {},
});
