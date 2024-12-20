import { CircularProgress } from "@mui/material";
import { IconType } from "react-icons/lib";

const TagIconDisplay = (tagName: string, size:number, availableIcons:Record<string, IconType>) => {
    
  console.log(availableIcons)
  const IconComponent = availableIcons[tagName];

  if (!IconComponent) {
    console.log("ayo here")
    return <CircularProgress />;
  }

  console.log("WHYYYYY")

  return <IconComponent size={size} />;
};

export default TagIconDisplay;
