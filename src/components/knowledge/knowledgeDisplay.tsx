import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteProject, getProjects } from "../../store/slices/projectSlice";
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
import DeleteButton from "../shared/deleteButton";

const KnowledgeBaseDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.project,
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Dev date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Displayed</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.ProjectID}
              hover
              style={{ cursor: "pointer" }}
            >
              <TableCell className="w-1/6 h-1/2">
                <img src={project.Logo_Path ? project.Logo_Path : ""} />
              </TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.DevDate.toString().split("T")[0]}</TableCell>
              <TableCell>{project.Status.Status}</TableCell>
              <TableCell>{project.Hidden ? "Hidden" : "Shown"}</TableCell>
              <TableCell>
                <p>Super sick button</p>
              </TableCell>
              <TableCell>
                <DeleteButton
                  deleteFunction={() =>
                    dispatch(deleteProject(project.ProjectID))
                  }
                  displayName={`project ${project.Name}`}
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
