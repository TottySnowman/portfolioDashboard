import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getProjects } from "../store/slices/projectSlice";

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.project,
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Projects</p>
      {projects.map((project) => (
        <p>{project.Name}</p>
      ))}
    </div>
  );
};

export default Projects;
