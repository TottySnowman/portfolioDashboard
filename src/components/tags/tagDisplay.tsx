import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { deleteTag, getTags } from "../../store/slices/tagSlice";
import {
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteButton from "../shared/deleteButton";
import { loadIcon } from "./iconMapper";
import { IconType } from "react-icons/lib";

const TagDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags, loading, error } = useSelector((state: RootState) => state.tag);
  const [availableIcons, setAvailableIcons] = useState<
    Record<string, IconType>
  >({});

  const displayTag = (tagName: string) => {
    const IconComponent = availableIcons[tagName];

    if (!IconComponent) {
      return <CircularProgress />;
    }

    return <IconComponent size={20} />;
  };
  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && tags.length > 0) {
      const loadIcons = async () => {
        const iconEntries = await Promise.all(
          tags.map(async (tag) => {
            try {
              const selectedIcon = await loadIcon(tag.TagIcon);
              return [tag.TagIcon, selectedIcon as IconType];
            } catch (error) {
              console.error(
                `Failed to load icon for tag: ${tag.TagIcon}`,
                error,
              );
              return null;
            }
          }),
        );

        const iconObject = Object.fromEntries(
          iconEntries.filter(Boolean) as [string, IconType][],
        );
        setAvailableIcons(iconObject);
      };

      loadIcons();
    }
  }, [tags, loading]);

  const editTag = (tagId: Number) => {
    console.log(tagId);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>TagIcon</TableCell>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.TagId} hover style={{ cursor: "pointer" }}>
              <TableCell className="w-1/6 h-1/2">
                {displayTag(tag.TagIcon)}
              </TableCell>
              <TableCell>{tag.Tag}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    editTag(tag.TagId);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <DeleteButton
                  deleteFunction={() => dispatch(deleteTag(tag.TagId))}
                  displayName={`tag ${tag.Tag}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TagDisplay;
