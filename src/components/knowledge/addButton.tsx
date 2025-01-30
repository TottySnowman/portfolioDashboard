import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import { Button } from "@mui/material";
import CustomSnackbar from "../shared/snackbar";
import KnowledgeModifyModal, { KnowledgeFormData } from "./modifyModal";
import { createKnowledge, knowledge } from "../../store/slices/knowledgeSlice";

const AddKnowledgeButton = () => {
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

  const onSubmit = (data: KnowledgeFormData) => {
    var knowledge: knowledge = {
      Prompt: data.knowledgeText,
      PointId: ""
    };
    dispatch(createKnowledge(knowledge))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully created the knowledge: ${result}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to create knowledge: ${error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });

    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Knowledge
      </Button>

      <KnowledgeModifyModal
        modalOpen={openModal}
        handleCloseModal={handleClose}
        existingKnowledge={null}
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

export default AddKnowledgeButton;
