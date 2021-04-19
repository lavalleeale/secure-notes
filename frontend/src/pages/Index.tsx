import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { encode, decode } from "base64-arraybuffer";
import React from "react";
import AddNoteDialog from "../components/AddNoteDialog";
import { Link } from "react-router-dom";
import { KeyContext } from "../context/KeyContext";
import { Create, Delete } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";
import EditNoteDialog from "../components/EditNoteDiaglog";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../lib/constants";

const enc = new TextEncoder();
const dec = new TextDecoder();

const Index = () => {
  const [notes, setNotes] = React.useState<
    { title: string; body: string; id: string }[]
  >([]);
  const [editingBody, setEditingBody] = React.useState("");
  const [editingTitle, setEditingTitle] = React.useState("");
  const [editingID, setEditingID] = React.useState("");
  const [addNoteOpen, setAddNoteOpen] = React.useState(false);
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);

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
          const id = uuidv4();
          const encodedNote = {
            note: encode(note),
            iv: encode(iv.buffer),
            id,
          };
          fetch(`${API_BASE_URL}/notes/addNote`, {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
              "X-CSRF-TOKEN": Cookies.get("csrf_access_token") as string,
            },
            body: JSON.stringify(encodedNote),
          }).then((response) => response.text().then(console.log));
        });
    }
  }

  function editNote(title: string, body: string, id: string) {
    if (key) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      window.crypto.subtle
        .encrypt(
          { name: "AES-GCM", iv },
          key,
          enc.encode(JSON.stringify({ title, body }))
        )
        .then((note) => {
          fetch(`${API_BASE_URL}/notes/updateNote`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "content-type": "application/json",
              "X-CSRF-TOKEN": Cookies.get("csrf_access_token") as string,
            },
            body: JSON.stringify({
              data: encode(note),
              iv: encode(iv),
              id: id,
            }),
          }).then(() => setNotes([...notes, { title, body, id }]));
        });
    }
  }

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/notes/getAllNotes`, {
      credentials: "include",
    }).then((response) =>
      response.json().then((data: { iv: string; data: string; id: any }[]) => {
        if (key) {
          console.log(data);
          Promise.all(
            data.map((note: { iv: string; data: string; id: any }) => {
              console.log(decode(note.iv));
              return window.crypto.subtle
                .decrypt(
                  { name: "AES-GCM", iv: decode(note.iv) },
                  key,
                  decode(note.data)
                )
                .then((decryptedNote) => ({
                  ...JSON.parse(dec.decode(decryptedNote)),
                  id: note.id,
                }));
            })
          ).then((newNotes) => {
            if (JSON.stringify(newNotes) !== JSON.stringify(notes))
              setNotes(newNotes);
          });
        }
      })
    );
  }, [notes, key]);

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
                  fetch(`${API_BASE_URL}/notes/deleteNote/${note.id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                      "X-CSRF-TOKEN": Cookies.get(
                        "csrf_access_token"
                      ) as string,
                    },
                  });
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
