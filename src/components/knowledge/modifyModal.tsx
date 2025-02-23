import * as yup from "yup";
import { ModalStyle } from "../shared/modalStyle";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { knowledge } from "../../store/slices/knowledgeSlice";

const tagSchema = yup
  .object({
    knowledgeText: yup.string().required("Knowledge is required!"),
  })
  .required();
export type KnowledgeFormData = yup.InferType<typeof tagSchema>;

interface knowledgeModalImport {
  modalOpen: boolean;
  handleCloseModal: () => void;
  existingKnowledge: knowledge | null;
  onSubmit: (data: KnowledgeFormData) => void;
}

const KnowledgeModifyModal = (modalImport: knowledgeModalImport) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KnowledgeFormData>({
    resolver: yupResolver(tagSchema),
    defaultValues: {
      knowledgeText: modalImport.existingKnowledge?.Prompt,
    },
  });

  return (
    <Modal
      open={modalImport.modalOpen}
      onClose={() => modalImport.handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ModalStyle}>
        <Typography id="modalemodal-title" variant="h6" component="h2">
          {modalImport.existingKnowledge
            ? "Edit Knowledge"
            : "Create Knowledge"}
        </Typography>
        <form
          onSubmit={handleSubmit(modalImport.onSubmit)}
          className="w-full flex flex-col gap-2 mt-3"
        >
          <div className="flex flex-col">
            <TextField
              id="outlined-basic"
              label="Knowledge text"
              variant="outlined"
              {...register("knowledgeText")}
              error={errors.knowledgeText?.message != null}
            />
            <p className="text-red-500">{errors.knowledgeText?.message}</p>
          </div>

          <div className="w-full flex gap-2 mt-5 justify-end">
            <Button variant="contained" type="submit">
              {modalImport.existingKnowledge ? "Update" : "Create"}
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

export default KnowledgeModifyModal;
