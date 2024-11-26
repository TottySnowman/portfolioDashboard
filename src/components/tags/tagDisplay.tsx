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
import { GrReactjs, GrGolang } from "react-icons/gr";
import { FaNodeJs, FaJava, FaPhp } from "react-icons/fa";
import { AiOutlineHtml5 } from "react-icons/ai";
import { TbBrandNextjs, TbBrandCss3 } from "react-icons/tb";
import {
  SiTypescript,
  SiJavascript,
  SiNeo4J,
  SiHiveBlockchain,
  SiSolidity,
  SiCsharp,
} from "react-icons/si";
import { BsImageFill } from "react-icons/bs";

const iconMappings: Record<
  string,
  React.FC<{ className?: string; size?: number }>
> = {
  GrReactjs: GrReactjs,
  TbBrandNextjs: TbBrandNextjs,
  FaNodeJs: FaNodeJs,
  FaJava: FaJava,
  FaPhp: FaPhp,
  SiTypescript: SiTypescript,
  TbBrandCss3: TbBrandCss3,
  SiJavascript: SiJavascript,
  BsImageFill: BsImageFill,
  AiOutlineHtml5: AiOutlineHtml5,
  SiNeo4J: SiNeo4J,
  SiHiveBlockchain: SiHiveBlockchain,
  SiSolidity: SiSolidity,
  SiCsharp: SiCsharp,
  GrGolang: GrGolang
};


const TagDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags, loading, error } = useSelector((state: RootState) => state.tag);

const displayTag = (tagName: string) => {
  const IconComponent = iconMappings[tagName];

  if (!IconComponent) {
    return <div>Invalid icon name</div>;
  }

  return <IconComponent size={20} />;
};
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
