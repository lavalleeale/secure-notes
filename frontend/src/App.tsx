import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import * as React from "react";
import { initDB, useIndexedDB } from "react-indexed-db";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import useDarkMode from "use-dark-mode";
import Header from "./components/Header";
import { KeyContext } from "./context/KeyContext";
import { UserContext } from "./context/UserContext";
import { DBConfig } from "./lib/DBConfig";
import GenerateKey from "./pages/GenerateKey";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Note from "./pages/Note";
import Register from "./pages/Register";

initDB(DBConfig);

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
  props: {
    MuiButton: { variant: "outlined" },
    MuiTextField: { variant: "outlined" },
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
  props: {
    MuiButton: { variant: "outlined" },
    MuiTextField: { variant: "outlined" },
  },
});

function App() {
  const darkMode = useDarkMode();
  const db = useIndexedDB("keys");
  const [key, setKey] = React.useState<CryptoKey>();
  const [user, setUser] = React.useState("");
  const [needKey, setNeedKey] = React.useState(false);

  React.useEffect(() => {
    db.getAll().then((keys) => {
      if (keys.length === 0) {
        setNeedKey(true);
      } else if (key === undefined) {
        setKey(keys[0]);
      }
    });
  }, [db, key]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <KeyContext.Provider value={{ key, setKey, needKey, setNeedKey }}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <Router>
            {user && !key && <Redirect to="/generate" />}
            {!user && <Redirect to="/login" />}
            <Header />
            <Switch>
              <Route path="/note/:id">
                <Note />
              </Route>
              <Route path="/generate">
                <GenerateKey />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/">
                <Index />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </KeyContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
