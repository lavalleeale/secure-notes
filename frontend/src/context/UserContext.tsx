import * as React from "react";

export const UserContext = React.createContext<{
  user: string;
  setUser(name: string): void;
}>({
  user: "",
  setUser: () => {},
});
