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
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProject, Project } from "../../store/slices/projectSlice";
import { getTags, Tag } from "../../store/slices/tagSlice";

const projectSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    gitHubLink: yup.string().nullable(),
    demoLink: yup.string().nullable(),
    devDate: yup
      .date()
      .required("Dev Date is required")
      .default(() => new Date()),
  })
  .required();
type FormData = yup.InferType<typeof projectSchema>;

const AddProject = () => {
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
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const { tags } = useSelector((state: RootState) => state.tag);

  const handleOpenModal = async () => {
    setOpen(true);
  };

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    // Convert selected TagIds back to full Tag objects
    const selectedTagObjects = tags.filter((tag) => value.includes(tag.TagId));
    setSelectedTags(selectedTagObjects);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      devDate: new Date(),
    },
  });
  const devDateValue = watch("devDate")
    ? new Date(watch("devDate")).toISOString().split("T")[0]
    : "";

  const onSubmit = (data: FormData) => {
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
    };
    dispatch(createProject(project));
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Project
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Project
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                defaultValue={devDateValue}
                {...register("devDate")}
              />
              <p className="text-red-500">{errors.devDate?.message}</p>
            </div>

            <div className="flex flex-col">
              <FormControl >
                <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={selectedTags.map((tag) => tag.TagId)}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as number[]).map((tagId) => {
                        const tag = tags.find((t) => t.TagId === tagId);
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
              </FormControl>
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
    </>
  );
};

export default AddProject;
