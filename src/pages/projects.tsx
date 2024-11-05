import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getProjects } from "../store/slices/projectSlice";
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
import DeleteButton from "../components/project/deleteButton";

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.project,
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const displayProject = (projectID: number) => {
    console.log(projectID);
  };

  const editProject = (projectID: number) => {
    console.log(projectID);
  };

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
              onClick={() => displayProject(project.ProjectID)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    editProject(project.ProjectID);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <DeleteButton
                  ProjectID={project.ProjectID}
                  Name={project.Name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Projects;
