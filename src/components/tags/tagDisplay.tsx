import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
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

const TagDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags, loading, error } = useSelector((state: RootState) => state.tag);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const editTag = (tagId: number) => {
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
              <TableCell className="w-1/6 h-1/2"></TableCell>
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
