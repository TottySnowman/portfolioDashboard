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
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ModalStyle } from "../shared/modalStyle";

const tagSchema = yup.object({
  TagId: yup.number().required("Tag ID is required"),
  Tag: yup.string().required("Tag name is required"),
  Icon: yup.string().required("Tag icon is required"),
});

const ProjectFormSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    gitHubLink: yup.string().nullable(),
    demoLink: yup.string().nullable(),
    tags: yup.array(tagSchema).min(1, "At least one tag must be selected"),
    devDate: yup.string().required("Dev Date is required"),
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

  useEffect(() => {
    dispatch(getTags());
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
