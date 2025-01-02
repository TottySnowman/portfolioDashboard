import { useEffect, useState } from "react";
import LanguageSelector from "./languageSelector";
import DisplayCvButton from "./displayCvButton";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { CheckExistingCv } from "../../store/slices/cvSlice";
import ModifyButton from "./modifyCvButton";

const CvDisplay = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");

  const dispatch: AppDispatch = useDispatch();
  const [pdfLink, setPdfLink] = useState<string | null>(null);

  useEffect(() => {
    dispatch(CheckExistingCv(selectedLanguage))
      .unwrap()
      .then((result) => {
        setPdfLink(result);
      })
      .catch((_) => {
        setPdfLink(null);
      });
  }, [selectedLanguage]);
  return (
    <div className="flex flex-col gap-5">
      <LanguageSelector
        setLanguage={setSelectedLanguage}
        selectedLanguage={selectedLanguage}
      />

      <div className="flex flex-row justify-evenly">
        <DisplayCvButton pdfLink={pdfLink} />
        <ModifyButton pdfLink={pdfLink} selectedLanguage={selectedLanguage} />
      </div>
    </div>
  );
};

export default CvDisplay;
