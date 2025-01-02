import { Button } from "@mui/material";
interface props {
  pdfLink: string | null;
}
const DisplayCvButton = (props: props) => {
  const handleDisplayCv = () => {
    if (props.pdfLink == null) {
      return;
    }
    window.open(props.pdfLink, "_blank", "noopener,noreferrer");
  };
  return (
    <Button
      disabled={props.pdfLink == null}
      variant="contained"
      onClick={() => handleDisplayCv()}
    >
      Display Cv
    </Button>
  );
};

export default DisplayCvButton;
