import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { createTag, Tag } from "../../store/slices/tagSlice";
import TagIconDisplay from "./tagIconDisplay";
import { IconType } from "react-icons/lib";
import { loadIcon } from "./iconMapper";
import CustomSnackbar from "../shared/snackbar";

const projectSchema = yup
  .object({
    iconTag: yup.string().required("Tag is required!"),
    displayName: yup.string().required("Display name is required!"),
  })
  .required();
type FormData = yup.InferType<typeof projectSchema>;

const AddTagButton = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleOpenModal = async () => {
    setOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [selectedIcon, setSelectedIcon] = useState<Record<string, IconType>>(
    {},
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(projectSchema),
  });

  const onSubmit = (data: FormData) => {
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

  const tagIcon = watch("iconTag");
  useEffect(() => {
    const fetchIcon = async () => {
      let icon = await loadIcon(tagIcon);
      setSelectedIcon({ [tagIcon]: icon as IconType });
    };

    fetchIcon();
  }, [tagIcon]);

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Tag
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modalemodal-title" variant="h6" component="h2">
            Create Tag
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2 mt-3"
          >
            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="React icon name"
                variant="outlined"
                {...register("iconTag")}
                error={errors.iconTag?.message != null}
              />
              <p className="text-red-500">{errors.iconTag?.message}</p>
            </div>

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Display name"
                variant="outlined"
                multiline
                error={errors.displayName?.message != null}
                {...register("displayName")}
              />
              <p className="text-red-500">{errors.displayName?.message}</p>
            </div>
            <div className="flex flex-col">
              {TagIconDisplay(tagIcon, 100, selectedIcon)}
            </div>

            <div className="w-full flex gap-2 mt-5 justify-end">
              <Button variant="contained" type="submit">
                Create
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleClose()}
              >
                Close
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

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
