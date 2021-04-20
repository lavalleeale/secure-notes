import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import React from "react";

const EditNoteDialog = ({
  open,
  handleClose,
  onSubmit,
  existingBody,
  existingTitle,
}: {
  open: boolean;
  handleClose(): void;
  onSubmit(title: string, body: string): void;
  existingBody: string;
  existingTitle: string;
}) => {
  const [title, setTitle] = React.useState(existingTitle);
  const [body, setBody] = React.useState(existingBody);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Note</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit a note, please enter the details here.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id="title"
          label="Title"
          margin="dense"
          onChange={(e) => setTitle(e.target.value)}
          required
          value={title}
        />
        <TextField
          fullWidth
          id="body"
          label="Body"
          margin="dense"
          multiline
          onChange={(e) => setBody(e.target.value)}
          required
          value={body}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
            onSubmit(title, body);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNoteDialog;
