import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { updateTag, Tag } from "../../store/slices/tagSlice";
import CustomSnackbar from "../shared/snackbar";
import TagModifyModal, { TagFormData } from "./modifyModal";

const EditButton = (existingTag: Tag) => {
  const dispatch: AppDispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = (data: TagFormData) => {
    var tag: Tag = {
      TagId: existingTag.TagId,
      Icon: data.iconTag,
      Tag: data.displayName,
    };
    dispatch(updateTag(tag))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully updated the tag: ${result.Tag}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to update tag: ${error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpenModal}>
        <EditIcon />
      </IconButton>

      <TagModifyModal
        modalOpen={openModal}
        handleCloseModal={handleClose}
        existingTag={existingTag}
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

export default EditButton;
