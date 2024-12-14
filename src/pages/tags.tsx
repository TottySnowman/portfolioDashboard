import AddTagButton from "../components/tags/addButton";
import TagDisplay from "../components/tags/tagDisplay";

const Tags = () => {
  return (
      <div className="w-full flex justify-center items-center">
      <div className="mt-3 container">
        <div className="w-full flex justify-end mb-3">
          <AddTagButton />
        </div>
        <TagDisplay />
      </div>
    </div>

  );
};

export default Tags;

