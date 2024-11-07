import AddProject from "../components/project/addProject";
import ProjectDisplay from "../components/project/projectDisplay";

const ProjectPage = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="mt-3 container">
        <div className="w-full flex justify-end mb-3">
          <AddProject />
        </div>
        <ProjectDisplay />
      </div>
    </div>
  );
};

export default ProjectPage;
