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
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProject, Project } from "../../store/slices/projectSlice";
import { getTags } from "../../store/slices/tagSlice";

const tagSchema = yup.object({
  TagId: yup.number().required("Tag ID is required"),
  Tag: yup.string().required("Tag name is required"),
  Icon: yup.string().required("Tag icon is required"),
});

const projectSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    gitHubLink: yup.string().nullable(),
    demoLink: yup.string().nullable(),
    tags: yup.array(tagSchema).min(1, "At least one tag must be selected"),
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

  const { tags } = useSelector((state: RootState) => state.tag);

  const handleOpenModal = async () => {
    setOpen(true);
  };

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      devDate: new Date(),
      tags: [],
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
      Tags: data.tags ? data.tags : [],
    };
    console.log(project);
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
