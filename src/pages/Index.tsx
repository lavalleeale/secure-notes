import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { useIndexedDB } from "react-indexed-db";
import React from "react";
import AddNoteDialog from "../components/AddNoteDialog";
import { Link } from "react-router-dom";
import { KeyContext } from "../context/KeyContext";
import { Create, Delete } from "@material-ui/icons";
import EditNoteDialog from "../components/EditNoteDiaglog";

const enc = new TextEncoder();
const dec = new TextDecoder();

const Index = () => {
  const [notes, setNotes] = React.useState<
    { title: string; body: string; id: number }[]
  >([]);
  const [editingBody, setEditingBody] = React.useState("");
  const [editingTitle, setEditingTitle] = React.useState("");
  const [editingID, setEditingID] = React.useState(0);
  const [addNoteOpen, setAddNoteOpen] = React.useState(false);
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);

  const db = useIndexedDB("notes");
  const { key } = React.useContext(KeyContext);

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
          db.add({ note, iv }).then((id: number) =>
            setNotes([...notes, { title, body, id }])
          );
        });
    }
  }

  function editNote(title: string, body: string, id: number) {
    if (key) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      window.crypto.subtle
        .encrypt(
          { name: "AES-GCM", iv },
          key,
          enc.encode(JSON.stringify({ title, body }))
        )
        .then((note) => {
          db.update({ note, iv, id }).then(() =>
            setNotes([...notes, { title, body, id }])
          );
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

  return (
    <Paper className="paper">
      <AddNoteDialog
        open={addNoteOpen}
        handleClose={() => setAddNoteOpen(false)}
        onSubmit={addNote}
      />
      {editNoteOpen && (
        <EditNoteDialog
          open={editNoteOpen}
          handleClose={() => setEditNoteOpen(false)}
          onSubmit={(title: string, body: string) =>
            editNote(title, body, editingID)
          }
          existingBody={editingBody}
          existingTitle={editingTitle}
        />
      )}
      <List>
        {notes.map((note) => (
          <ListItem
            button
            component={Link}
            to={`note/${note.id}`}
            key={note.title}
          >
            <ListItemText primary={note.title} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {
                  setEditingBody(note.body);
                  setEditingTitle(note.title);
                  setEditingID(note.id);
                  setEditNoteOpen(true);
                }}
              >
                <Create />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => {
                  db.deleteRecord(note.id);
                  setNotes(notes.filter((data) => note.id !== data.id));
                }}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
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
