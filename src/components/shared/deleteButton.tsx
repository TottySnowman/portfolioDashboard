import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";

export interface deleteObject {
  deleteFunction: () => void;
  displayName: string;
}

const DeleteButton = (objectToDelete: deleteObject) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const openConfirmationModal = () => {
    setOpen(true);
  };

  const handleConfirmButton = async () => {
    objectToDelete.deleteFunction();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          openConfirmationModal();
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Project
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete {objectToDelete.displayName}?
          </Typography>
          <div className="w-full flex gap-2 mt-5 justify-end">
            <Button variant="contained" onClick={() => handleConfirmButton()}>
              Delete
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleClose()}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteButton;
