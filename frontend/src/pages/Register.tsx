import {
  Avatar,
  Button,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import zxcvbn, { ZXCVBNResult } from "zxcvbn";
import React from "react";
import { UserContext } from "../context/UserContext";
import { Link, Redirect } from "react-router-dom";
import { API_BASE_URL } from "../lib/constants";

const Register = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [passwordFeedback, setPasswordFeedback] = React.useState<ZXCVBNResult>(
    zxcvbn("")
  );
  const [finished, setFinished] = React.useState(false);

  const { setUser } = React.useContext(UserContext);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (window.PasswordCredential) {
      const creds = new window.PasswordCredential({
        id: username,
        password: password,
        name: name,
      });
      window.navigator.credentials.store(creds);
    }
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password, name }),
      credentials: "include",
    }).then((response) =>
      response.json().then((json) => {
        setUser(json.name);
        setFinished(true);
      })
    );
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
            label="Name"
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginTop: 10, width: "50%" }}
            value={name}
          />
        </div>
        <div>
          <Tooltip
            title={
              <>
                <Typography>Password Suggestions: </Typography>
                {passwordFeedback.feedback.suggestions.length === 0 ? (
                  <Typography>None, All Good!</Typography>
                ) : (
                  <ul>
                    {passwordFeedback.feedback.suggestions.map((suggestion) => (
                      <li key={suggestion}>
                        <Typography variant="caption">{suggestion}</Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            }
            arrow
            placement="top-end"
          >
            <TextField
              error={password !== "" && passwordFeedback.score < 3}
              helperText={
                !password
                  ? ""
                  : passwordFeedback.feedback.warning ||
                    `Password Strength: ${
                      [
                        "too guessable",
                        "very guessable",
                        "somwhat guessable",
                        "safely unguessable",
                        "very unguessable",
                      ][passwordFeedback.score]
                    }`
              }
              label="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordFeedback(zxcvbn(e.target.value));
              }}
              required
              style={{ marginTop: 10, width: "50%" }}
              value={password}
            />
          </Tooltip>
        </div>
        <Button
          style={{ marginTop: 10, width: "50%" }}
          color="primary"
          variant="contained"
          type="submit"
        >
          Register
        </Button>
      </form>
      <Typography style={{ marginTop: 10 }}>
        Already Have An Account:
      </Typography>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button style={{ width: "50%" }} color="primary" variant="contained">
          Login
        </Button>
      </Link>
    </Paper>
  );
};

export default Register;
