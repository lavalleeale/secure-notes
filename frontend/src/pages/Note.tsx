import { Divider, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import { KeyContext } from "../context/KeyContext";
import { decode } from "base64-arraybuffer";
import { API_BASE_URL } from "../lib/constants";

const dec = new TextDecoder();

const Note = () => {
  const [note, setNote] = React.useState<{ title: string; body: string }>();

  const { key } = React.useContext(KeyContext);
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    if (note === undefined) {
      fetch(`${API_BASE_URL}/notes/getNote/${id}`, {
        credentials: "include",
      }).then((response) =>
        response.json().then((data) => {
          if (key) {
            window.crypto.subtle
              .decrypt(
                { name: "AES-GCM", iv: decode(data.iv) },
                key,
                decode(data.data)
              )
              .then((decryptedNote) => {
                const parsedNote = JSON.parse(dec.decode(decryptedNote));
                setNote(parsedNote);
              });
          }
        })
      );
    }
  }, [key, id, note]);

  return (
    <Paper className="paper">
      {note && (
        <div>
          <Typography variant="h4">{note.title}</Typography>
          <Divider />
          {note.body.split("\n").map((line) => (
            <Typography key={line}>{line}</Typography>
          ))}
        </div>
      )}
    </Paper>
  );
};

export default Note;
