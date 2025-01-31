import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  deleteKnowledge,
  getKnowledge,
} from "../../store/slices/knowledgeSlice";
import EditButton from "./editButton";
import DeleteButton from "../shared/deleteButton";

const KnowledgeBaseDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { knowledges, loading, error } = useSelector(
    (state: RootState) => state.knowledge,
  );

  useEffect(() => {
    dispatch(getKnowledge());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {knowledges.map((knowledge) => (
            <TableRow
              key={knowledge.pointId}
              hover
              style={{ cursor: "pointer" }}
            >
              <TableCell>{knowledge.Prompt}</TableCell>
              <TableCell>
                <EditButton
                  pointId={knowledge.pointId}
                  Prompt={knowledge.Prompt}
                />
              </TableCell>
              <TableCell>
                <DeleteButton
                  deleteFunction={() =>
                    dispatch(deleteKnowledge({ pointId: knowledge.pointId }))
                  }
                  displayName={`knowledge ${knowledge.Prompt}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KnowledgeBaseDisplay;
