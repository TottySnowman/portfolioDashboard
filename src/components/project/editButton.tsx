import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Project, updateProject } from "../../store/slices/projectSlice";
import { getTags } from "../../store/slices/tagSlice";
import CustomSnackbar from "../shared/snackbar";
import ModifyProjectModal, { projectFormData } from "./projectModifyModal";

interface importParams {
  existingProject: Project;
}
const EditProject = (importParams: importParams) => {
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
    var project: Project = {
      ProjectID: importParams.existingProject.ProjectID,
      Name: data.title,
      About: data.description,
      Github_Link: data.gitHubLink ? data.gitHubLink : null,
      Demo_Link: data.demoLink ? data.demoLink : null,
      DevDate: new Date(data.devDate),
      Logo_Path: null,
      Hidden: data.hidden,
      Status: {
        Status: data.status.Status,
        StatusID: data.status.StatusID,
      },
      Tags: data.tags ? data.tags : [],
    };
    dispatch(updateProject(project))
      .unwrap()
      .then((result) => {
        setSnackbarMessage(`Successfully updated the project: ${result.Name}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to update project: ${error}`);
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

      <ModifyProjectModal
        modalOpen={open}
        handleCloseModal={handleClose}
        existingProject={importParams.existingProject}
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

export default EditProject;
