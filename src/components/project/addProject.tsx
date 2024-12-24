import { Button } from "@mui/material";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createProject, Project } from "../../store/slices/projectSlice";
import { getTags } from "../../store/slices/tagSlice";
import CustomSnackbar from "../shared/snackbar";
import ModifyProjectModal, { projectFormData } from "./projectModifyModal";

const AddProject = () => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenModal = async () => {
    setOpen(true);
  };

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const onSubmit = (data: projectFormData) => {
    var project: Omit<Project, "ProjectID"> = {
      Name: data.title,
      About: data.description,
      Github_Link: data.gitHubLink ? data.gitHubLink : null,
      Demo_Link: data.demoLink ? data.demoLink : null,
      DevDate: data.devDate,
      Logo_Path: null,
      Hidden: false,
      Status: {
        Status: "On going",
        StatusID: 1,
      },
      Tags: data.tags ? data.tags : [],
    };
    dispatch(createProject(project))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully created the project: ${result.Name}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to create project: ${error}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Project
      </Button>

      <ModifyProjectModal
        modalOpen={open}
        handleCloseModal={handleClose}
        existingProject={null}
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

export default AddProject;
