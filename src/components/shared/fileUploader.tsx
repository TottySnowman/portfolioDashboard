import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface fileUploadImport {
  submitFunction: (file: File) => void;
  allowedFileTypes: string[];
}

const FileUploader = (props: fileUploadImport) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateUploadedFileAndUpload = async () => {
    if (!props.allowedFileTypes.includes(selectedFile!.type)) {
      alert("Not allowed");
      return;
    }

    props.submitFunction(selectedFile as File);
  };

  const setTheFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) {
      return;
    }

    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile == null) {
      return;
    }

    validateUploadedFileAndUpload();
  }, [selectedFile]);

  return (
    <div className="flex flex-col gap-2">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => setTheFile(event)}
        />
      </Button>
    </div>
  );
};

export default FileUploader;
