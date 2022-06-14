// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguagesSettings } from "../store/slices/app";
import Language from "./Language";

const LanguageSettings = () => {
	// const dispatch = useDispatch();

	const languagesSettings = useSelector(selectLanguagesSettings);

	// TODO fetch stream params
	// useEffect(() => {
	// 	dispatch(getSource);
	// }, []);

	return (
		<div className="languages">
			{Object.entries(languagesSettings).map(([language, settings]) => (
				<Language key={language} language={language} languageSettings={settings} />
			))}
		</div>
	);
};

export default LanguageSettings;
