import { Button, Paper, TextField } from "@material-ui/core";
import React from "react";
import { useIndexedDB } from "react-indexed-db";

const enc = new TextEncoder();

const GenerateKey = () => {
  const [password, setPassword] = React.useState("");

  const db = useIndexedDB("keys");

  function generate(password: string) {
    window.crypto.subtle
      .importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, [
        "deriveKey",
      ])
      .then((importedPassword) => {
        window.crypto.subtle
          .deriveKey(
            {
              name: "PBKDF2",
              salt: enc.encode("the salt is this random string"),
              iterations: 100000,
              hash: "SHA-256",
            },
            importedPassword,
            {
              name: "AES-GCM",
              length: 256,
            },
            false,
            ["encrypt", "decrypt"]
          )
          .then((key) => db.add(key));
      });
  }

  return (
    <Paper className="paper">
      {JSON.stringify(db.getAll())}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate(password);
        }}
      >
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Generate Key</Button>
      </form>
    </Paper>
  );
};

export default GenerateKey;
