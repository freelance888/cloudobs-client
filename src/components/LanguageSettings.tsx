// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguagesSettings } from "../store/slices/app";
import ContentPanel from "./ContentPanel";
import Language from "./Language";
import StartStopStreamingButton from "./StartStopStreamingButton";

const LanguageSettings = () => {
	// const dispatch = useDispatch();

	const languagesSettings = useSelector(selectLanguagesSettings);

	// TODO fetch stream params
	// useEffect(() => {
	// 	dispatch(getSource);
	// }, []);

	return (
		<ContentPanel mainActions={<StartStopStreamingButton />} actionsOnTop>
			{Object.entries(languagesSettings).map(([language, settings]) => (
				<Language key={language} language={language} languageSettings={settings} />
			))}
		</ContentPanel>
	);
};

export default LanguageSettings;
