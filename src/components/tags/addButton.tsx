import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import { Button } from "@mui/material";
import { createTag, Tag } from "../../store/slices/tagSlice";
import CustomSnackbar from "../shared/snackbar";
import TagModifyModal, { TagFormData } from "./modifyModal";

const AddTagButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleOpenModal = async () => {
    setOpenModal(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = (data: TagFormData) => {
    var tag: Omit<Tag, "TagId"> = {
      Icon: data.iconTag,
      Tag: data.displayName,
    };
    dispatch(createTag(tag))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully created the tag: ${result.Tag}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to create tag: ${error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });

    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Tag
      </Button>

      <TagModifyModal
        modalOpen={openModal}
        handleCloseModal={handleClose}
        existingTag={null}
        onSubmit={onSubmit}
      />

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default AddTagButton;
