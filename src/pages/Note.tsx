import { Divider, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useIndexedDB } from "react-indexed-db";
import { useParams } from "react-router";

const dec = new TextDecoder();

const Note = () => {
  const [note, setNote] = React.useState<{ title: string; body: string }>();
  const [key, setKey] = React.useState<CryptoKey>();

  const { getAll: getAllKeys } = useIndexedDB("keys");
  const { getByID } = useIndexedDB("notes");
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    if (note === undefined) {
      getByID<{ note: ArrayBuffer; iv: Uint8Array; id: number }>(id).then(
        (data) => {
          if (key) {
            window.crypto.subtle
              .decrypt({ name: "AES-GCM", iv: data.iv }, key, data.note)
              .then((decryptedNote) => {
                const parsedNote = JSON.parse(dec.decode(decryptedNote));
                setNote(parsedNote);
              });
          }
        }
      );
    }
  }, [key, getByID, id, note]);

  React.useEffect(() => {
    getAllKeys().then((keys) => {
      if (key === undefined && keys.length !== 0) {
        setKey(keys[0]);
      }
    });
  }, [getAllKeys, key]);

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
