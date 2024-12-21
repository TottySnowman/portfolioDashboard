import * as yup from "yup";
import { ModalStyle } from "../shared/modalStyle";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { loadIcon } from "./iconMapper";
import { IconType } from "react-icons/lib";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import TagIconDisplay from "./tagIconDisplay";
import { Tag } from "../../store/slices/tagSlice";

const tagSchema = yup
  .object({
    iconTag: yup.string().required("Tag is required!"),
    displayName: yup.string().required("Display name is required!"),
  })
  .required();
export type TagFormData = yup.InferType<typeof tagSchema>;

interface tagModalImport {
  modalOpen: boolean;
  handleCloseModal: () => void;
  existingTag: Tag | null;
  onSubmit: (data: TagFormData) => void;
}

const TagModifyModal = (modalImport: tagModalImport) => {
  const [selectedIcon, setSelectedIcon] = useState<Record<string, IconType>>(
    {},
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: yupResolver(tagSchema),
    defaultValues:{
      iconTag: modalImport.existingTag?.Icon,
      displayName: modalImport.existingTag?.Tag
    }
  });

  const tagIcon = watch("iconTag");
  useEffect(() => {
    const fetchIcon = async () => {
      let icon = await loadIcon(tagIcon);
      setSelectedIcon({ [tagIcon]: icon as IconType });
    };

    fetchIcon();
  }, [tagIcon]);

  return (
    <Modal
      open={modalImport.modalOpen}
      onClose={() => modalImport.handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ModalStyle}>
        <Typography id="modalemodal-title" variant="h6" component="h2">
          {modalImport.existingTag ? "Edit Tag" : "Create Tag"}
        </Typography>
        <form
          onSubmit={handleSubmit(modalImport.onSubmit)}
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
              onClick={() => modalImport.handleCloseModal()}
            >
              Close
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default TagModifyModal;
