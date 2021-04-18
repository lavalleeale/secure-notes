import { Button, List, ListItem, ListItemText, Paper } from "@material-ui/core";
import { useIndexedDB } from "react-indexed-db";
import React from "react";
import AddNoteDialog from "../components/AddNoteDialog";
import { Link, Redirect } from "react-router-dom";

const enc = new TextEncoder();
const dec = new TextDecoder();

const Index = () => {
  const [notes, setNotes] = React.useState<
    { title: string; body: string; id: number }[]
  >([]);
  const [needKey, setNeedKey] = React.useState(false);
  const [key, setKey] = React.useState<CryptoKey>();
  const db = useIndexedDB("notes");
  const { getAll: getAllKeys } = useIndexedDB("keys");

  const [addNoteOpen, setAddNoteOpen] = React.useState(false);

  function addNote(title: string, body: string) {
    if (key) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      window.crypto.subtle
        .encrypt(
          { name: "AES-GCM", iv },
          key,
          enc.encode(JSON.stringify({ title, body }))
        )
        .then((note) => {
          db.add({ note, iv });
        });
    }
  }

  React.useEffect(() => {
    db.getAll<{ note: ArrayBuffer; iv: Uint8Array; id: number }>().then(
      (data) => {
        if (key) {
          Promise.all(
            data.map((note) =>
              window.crypto.subtle
                .decrypt({ name: "AES-GCM", iv: note.iv }, key, note.note)
                .then((decryptedNote) => ({
                  ...JSON.parse(dec.decode(decryptedNote)),
                  id: note.id,
                }))
            )
          ).then((newNotes) => {
            if (JSON.stringify(newNotes) !== JSON.stringify(notes))
              setNotes(newNotes);
          });
        }
      }
    );
  }, [db, notes, key]);

  React.useEffect(() => {
    getAllKeys().then((keys) => {
      if (keys.length === 0) {
        setNeedKey(true);
      } else if (key === undefined) {
        setKey(keys[0]);
      }
    });
  }, [getAllKeys, key]);

  return (
    <Paper className="paper">
      {needKey && <Redirect to="/generate" />}
      <AddNoteDialog
        open={addNoteOpen}
        handleClose={() => setAddNoteOpen(false)}
        onSubmit={addNote}
      />
      <List>
        {notes.map((note) => (
          <ListItem
            button
            component={Link}
            to={`note/${note.id}`}
            key={note.title}
          >
            <ListItemText primary={note.title} />
          </ListItem>
        ))}
      </List>
      <Button style={{ float: "right" }} onClick={() => setAddNoteOpen(true)}>
        Add Note
      </Button>
      <div style={{ marginBottom: 50 }} />
    </Paper>
  );
};

export default Index;
