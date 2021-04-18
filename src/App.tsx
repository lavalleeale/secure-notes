import * as React from "react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Index from "./pages/Index";
import Header from "./components/Header";
import { DBConfig } from "./lib/DBConfig";
import { initDB } from "react-indexed-db";
import Note from "./pages/Note";
import GenerateKey from "./pages/GenerateKey";

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
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Header />
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
  );
}

export default App;
