import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
interface props {
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
}
const LanguageSelector = (props: props) => {
  const handleChange = (event: SelectChangeEvent) => {
    props.setLanguage(event.target.value as string);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Language</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.selectedLanguage}
        label="Language"
        onChange={handleChange}
      >
        <MenuItem value={"de-CH"}>German</MenuItem>
        <MenuItem value={"en-US"}>English</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
