import {
  Avatar,
  Button,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { UserContext } from "../context/UserContext";
import { Link, Redirect } from "react-router-dom";
import { API_BASE_URL } from "../lib/constants";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [finished, setFinished] = React.useState(false);

  const { setUser } = React.useContext(UserContext);

  const login = React.useCallback(
    (username: string, password: string) => {
      fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      }).then((response) =>
        response.json().then((json) => {
          setUser(json.name);
          setFinished(true);
        })
      );
    },
    [setUser]
  );

  React.useEffect(() => {
    if (window.PasswordCredential) {
      window.navigator.credentials
        .get({
          password: true,
        } as CredentialRequestOptions)
        .then((creds) => {
          if (creds) {
            login(creds.id, (creds as any).password);
          }
        });
    }
  }, [login]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(username, password);
  }

  return (
    <Paper className="paper" style={{ textAlign: "center" }}>
      {finished && <Redirect to="/" />}
      <Avatar style={{ margin: "auto" }}>SC</Avatar>
      <Typography variant="h5">Register:</Typography>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginTop: 10, width: "50%" }}
            value={username}
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginTop: 10, width: "50%" }}
            value={password}
          />
        </div>
        <Button
          style={{ marginTop: 10, width: "50%" }}
          color="primary"
          variant="contained"
          type="submit"
        >
          Login
        </Button>
      </form>
      <Typography style={{ marginTop: 10 }}>
        Don't Have An Account Yet:
      </Typography>
      <Link to="/register" style={{ textDecoration: "none" }}>
        <Button style={{ width: "50%" }} color="primary" variant="contained">
          Register
        </Button>
      </Link>
    </Paper>
  );
};

export default Login;
