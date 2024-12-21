import { CircularProgress } from "@mui/material";
import { IconType } from "react-icons/lib";

const TagIconDisplay = (tagName: string, size:number, availableIcons:Record<string, IconType>) => {
  const IconComponent = availableIcons[tagName];

  if (!IconComponent) {
    return <CircularProgress />;
  }

  return <IconComponent size={size} />;
};

export default TagIconDisplay;
