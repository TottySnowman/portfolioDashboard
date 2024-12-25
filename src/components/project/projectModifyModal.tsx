import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Project } from "../../store/slices/projectSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTags } from "../../store/slices/tagSlice";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
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
  })
  .required();

export type projectFormData = yup.InferType<typeof ProjectFormSchema>;

interface projectModalImport {
  modalOpen: boolean;
  handleCloseModal: () => void;
  existingProject: Project | null;
  onSubmit: (data: projectFormData) => void;
}

const ModifyProjectModal = (projectImport: projectModalImport) => {
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
    formState: { errors },
  } = useForm<projectFormData>({
    resolver: yupResolver(ProjectFormSchema),
    defaultValues: {
      devDate: new Date().toISOString().split("T")[0],
      tags: [],
      status:{
        Status: "On going",
        StatusID: 1
      }
    },
  });
  return (
    <>
      <Modal
        open={projectImport.modalOpen}
        onClose={projectImport.handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {projectImport.existingProject ? "Edit Project" : "Create Project"}
          </Typography>
          <form
            onSubmit={handleSubmit(projectImport.onSubmit)}
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
            <div className="flex flex-col">
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  {...register("status.StatusID", { required: true })} // Register StatusID
                  error={errors?.status?.StatusID != null}
                >
                  {status.map((status) => (
                    <MenuItem key={status.StatusID} value={status.StatusID}>
                      {status.Status}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!!errors?.status?.StatusID}>
                  {errors?.status?.StatusID?.message}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="w-full flex gap-2 mt-5 justify-end">
              <Button variant="contained" type="submit">
                {projectImport.existingProject ? "Edit" : "Create"}
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => projectImport.handleCloseModal()}
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
