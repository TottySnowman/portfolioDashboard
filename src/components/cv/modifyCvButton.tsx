import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import FileUploader from "../shared/fileUploader";
import { CheckExistingCv, PostCv } from "../../store/slices/cvSlice";
interface props {
  pdfLink: string | null;
  selectedLanguage: string;
  setPdfLink: React.Dispatch<React.SetStateAction<string | null>>;
}

const ModifyButton = (props: props) => {
  const dispatch: AppDispatch = useDispatch();

  const handleCvUpload = (file: File) => {
    if (file == null) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    dispatch(
      PostCv({
        fileForm: formData,
        language: props.selectedLanguage,
      }),
    )
      .unwrap()
      .then(() => {
        return dispatch(CheckExistingCv(props.selectedLanguage)).unwrap();
      })
      .then((result) => {
        props.setPdfLink(result);
      })
      .catch((error) => {
        console.error(error);
        props.setPdfLink(null);
      });
  };

  return (
    <FileUploader
      submitFunction={handleCvUpload}
      allowedFileTypes={["application/pdf"]}
      customButtonMessage={props.pdfLink ? "Update Cv" : "Upload Cv"}
    />
  );
};

export default ModifyButton;
