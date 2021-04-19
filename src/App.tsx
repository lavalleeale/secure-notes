import * as React from "react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Index from "./pages/Index";
import Header from "./components/Header";
import { DBConfig } from "./lib/DBConfig";
import { initDB, useIndexedDB } from "react-indexed-db";
import Note from "./pages/Note";
import GenerateKey from "./pages/GenerateKey";
import { KeyContext } from "./context/KeyContext";

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
    <KeyContext.Provider value={{ key, setKey, needKey, setNeedKey }}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Router>
          <Header />
          {needKey && <Redirect to="/generate" />}
          <Switch>
            <Route path="/note/:id">
              <Note />
            </Route>
            <Route path="/generate">
              <GenerateKey />
            </Route>
            <Route path="/">
              <Index />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </KeyContext.Provider>
  );
}

export default App;
