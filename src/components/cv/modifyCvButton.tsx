import FileUploader from "../shared/fileUploader";
interface props {
  pdfLink: string | null;
  selectedLanguage: string;
}
const ModifyButton = (props: props) => {
  const handleCvUpload = (file: File) => {
    //TODO do the call to upload the cv with accept language
    console.log(file);
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
