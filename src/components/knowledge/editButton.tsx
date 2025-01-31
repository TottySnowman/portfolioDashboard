import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomSnackbar from "../shared/snackbar";
import KnowledgeModifyModal, { KnowledgeFormData } from "./modifyModal";
import { knowledge, updateKnowledge } from "../../store/slices/knowledgeSlice";

const EditButton = (existingKnowledge: knowledge) => {
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

  const onSubmit = (data: KnowledgeFormData) => {
    console.log(existingKnowledge.pointId)
    var knowledge: knowledge = {
      pointId: existingKnowledge.pointId,
      Prompt: data.knowledgeText
    };
    dispatch(updateKnowledge(knowledge))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully updated the knowledge: ${result.knowledge}`);
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

      <KnowledgeModifyModal
        modalOpen={openModal}
        handleCloseModal={handleClose}
        existingKnowledge={existingKnowledge}
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

