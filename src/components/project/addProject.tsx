import { Button } from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createProject, Project } from "../../store/slices/projectSlice";
import { getTags } from "../../store/slices/tagSlice";
import CustomSnackbar from "../shared/snackbar";
import ModifyProjectModal, { projectFormData } from "./projectModifyModal";
import { DeleteLogo } from "../../store/slices/logoSlice";

const AddProject = () => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const { filePath } = useSelector((state: RootState) => state.logo);

  const handleCloseAndDeleteLogo = () => {
    if (filePath != null) {
      const formData = new FormData();
      formData.append("filePath", filePath);
      dispatch(DeleteLogo(formData));
    }
    setOpen(false);
  };

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
      DevDate: new Date(data.devDate),
      Logo_Path: data.logoPath,
      Hidden: data.hidden,
      Status: {
        Status: data.status.Status,
        StatusID: data.status.StatusID,
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
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Project
      </Button>

      <ModifyProjectModal
        modalOpen={open}
        handleCloseModal={handleCloseAndDeleteLogo}
        existingProject={null}
        onSubmit={onSubmit}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
        setSnackbarOpen={setSnackbarOpen}
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
