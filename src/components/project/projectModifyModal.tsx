import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Project } from "../../store/slices/projectSlice";
import { AppDispatch, ErrorModel, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTags } from "../../store/slices/tagSlice";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ModalStyle } from "../shared/modalStyle";
import { getStatus } from "../../store/slices/statusSlice";
import FileUploader from "../shared/fileUploader";
import { PostLogo } from "../../store/slices/logoSlice";

const tagSchema = yup.object({
  TagId: yup.number().required("Tag ID is required"),
  Tag: yup.string().required("Tag name is required"),
  Icon: yup.string().required("Tag icon is required"),
});

const statusSchema = yup.object({
  StatusID: yup.number().required("Status Id is required"),
  Status: yup.string().required("Status is required"),
});

const ProjectFormSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    gitHubLink: yup.string().nullable(),
    demoLink: yup.string().nullable(),
    tags: yup.array(tagSchema).min(1, "At least one tag must be selected"),
    devDate: yup.string().required("Dev Date is required"),
    status: statusSchema.required("Status is required"),
    hidden: yup.boolean().default(false),
    logoPath: yup.string().required("Logo is required"),
  })
  .required();

export type projectFormData = yup.InferType<typeof ProjectFormSchema>;

interface projectModalImport {
  modalOpen: boolean;
  handleCloseModal: () => void;
  existingProject: Project | null;
  onSubmit: (data: projectFormData) => void;
  setSnackbarMessage: (value: React.SetStateAction<string>) => void;
  setSnackbarSeverity: (
    value: React.SetStateAction<"success" | "error">,
  ) => void;
  setSnackbarOpen: (value: React.SetStateAction<boolean>) => void;
}

const ModifyProjectModal = (props: projectModalImport) => {
  const dispatch: AppDispatch = useDispatch();
  const { tags } = useSelector((state: RootState) => state.tag);
  const { status } = useSelector((state: RootState) => state.status);

  useEffect(() => {
    dispatch(getTags());
    dispatch(getStatus());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<projectFormData>({
    resolver: yupResolver(ProjectFormSchema),
    defaultValues: {
      devDate: props.existingProject
        ? new Date(props.existingProject.DevDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      tags: props.existingProject ? props.existingProject.Tags : [],
      status: props.existingProject
        ? props.existingProject.Status
        : {
            StatusID: 1,
            Status: "On going",
          },
      title: props.existingProject?.Name,
      description: props.existingProject?.About,
      gitHubLink: props.existingProject?.Github_Link,
      demoLink: props.existingProject?.Demo_Link,
      hidden: props.existingProject ? props.existingProject.Hidden : false,
      logoPath: props.existingProject?.Logo_Path,
    },
  });

  const { filePath } = useSelector((state: RootState) => state.logo);
  const handleLogoUpload = (file: File) => {
    const fileForm = new FormData();
    fileForm.append("file", file);
    dispatch(PostLogo(fileForm))
      .unwrap()
      .then((_) => {
        props.setSnackbarMessage(`Successfully uploaded the logo`);
        props.setSnackbarSeverity("success");
        props.setSnackbarOpen(true);
      })
      .catch((error) => {
        const nError = error as ErrorModel;
        props.setSnackbarMessage(`Failed to upload logo: ${nError.errors}`);
        props.setSnackbarSeverity("error");
        props.setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    if (filePath != null) {
      setValue("logoPath", filePath);
    }
  }, [filePath]);

  return (
    <>
      <Modal
        open={props.modalOpen}
        onClose={props.handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.existingProject ? "Edit Project" : "Create Project"}
          </Typography>
          <form
            onSubmit={handleSubmit(props.onSubmit)}
            className="w-full flex flex-col gap-2 mt-3"
          >
            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                {...register("title")}
                error={errors.title?.message != null}
              />
              <p className="text-red-500">{errors.title?.message}</p>
            </div>

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                multiline
                error={errors.description?.message != null}
                minRows={6}
                {...register("description")}
              />
              <p className="text-red-500">{errors.description?.message}</p>
            </div>

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Demo Link"
                variant="outlined"
                multiline
                error={errors.demoLink?.message != null}
                {...register("demoLink")}
              />
              <p className="text-red-500">{errors.demoLink?.message}</p>
            </div>

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Github Link"
                variant="outlined"
                multiline
                error={errors.gitHubLink?.message != null}
                {...register("gitHubLink")}
              />
              <p className="text-red-500">{errors.gitHubLink?.message}</p>
            </div>

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Dev Date"
                variant="outlined"
                type="date"
                error={errors.devDate?.message != null}
                {...register("devDate")}
              />
              <p className="text-red-500">{errors.devDate?.message}</p>
            </div>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.tags} sx={{ width: "100%" }}>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    multiple
                    value={(field.value ?? []).map((tag) => tag.TagId)}
                    onChange={(e) => {
                      const selectedTagIds = e.target.value as number[];
                      const selectedTags = tags.filter((tag) =>
                        selectedTagIds.includes(tag.TagId),
                      );
                      field.onChange(selectedTags);
                    }}
                    input={<OutlinedInput id="select-multiple-chip" />}
                    renderValue={(selectedTagIds) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selectedTagIds.map((id) => {
                          const tag = tags.find((t) => t.TagId === id);
                          return tag ? (
                            <Chip key={tag.TagId} label={tag.Tag} />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.TagId} value={tag.TagId}>
                        {tag.Tag}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tags && (
                    <Typography color="error">{errors.tags.message}</Typography>
                  )}
                </FormControl>
              )}
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                {...register("status.StatusID", { required: true })}
                defaultValue={props.existingProject?.Status.StatusID || 1}
                error={errors?.status?.StatusID != null}
              >
                {status.map((statusItem) => (
                  <MenuItem
                    key={statusItem.StatusID}
                    value={statusItem.StatusID}
                  >
                    {statusItem.Status}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors?.status?.StatusID}>
                {errors?.status?.StatusID?.message}
              </FormHelperText>
            </FormControl>

            <div className="flex flex-row items-center">
              <p>Hidden</p>
              <Controller
                name="hidden"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="outlined-basic"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <p className="text-red-500">{errors.hidden?.message}</p>
            </div>

            {!props.existingProject && (
              <FileUploader
                submitFunction={(file) => handleLogoUpload(file)}
                allowedFileTypes={[
                  "image/png",
                  "image/webp",
                  "image/svg+xml",
                  "image/jpeg",
                ]}
              />
            )}

            <div className="flex flex-col">
              <TextField
                id="outlined-basic"
                label="Logo path"
                variant="outlined"
                {...register("logoPath")}
                disabled={true}
                error={errors.logoPath?.message != null}
              />
              <p className="text-red-500">{errors.logoPath?.message}</p>
            </div>

            <div className="w-full flex gap-2 mt-5 justify-end">
              <Button variant="contained" type="submit">
                {props.existingProject ? "Edit" : "Create"}
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => props.handleCloseModal()}
              >
                Close
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ModifyProjectModal;
