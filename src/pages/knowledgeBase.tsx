import AddKnowledgeButton from "../components/knowledge/addButton";
import KnowledgeBaseDisplay from "../components/knowledge/knowledgeDisplay";

const KnowledgeBasePage = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="mt-3 container">
        <div className="w-full flex justify-end mb-3">
          <AddKnowledgeButton />
        </div>

        <KnowledgeBaseDisplay />
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
