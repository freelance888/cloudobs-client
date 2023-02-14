import { useMemo } from "react";

import { useSelector } from "react-redux";
import { startStreaming, stopStreaming } from "../../../services/soketApi";

import { LanguageSettings } from "../../../services/types";
import { selectLanguagesSettings } from "../../../store/slices/app";

const StartStopStreamingButton = () => {
	const languagesSettings = useSelector(selectLanguagesSettings);

	const streamsActive = useMemo(() => {
		const languages = Object.keys(languagesSettings);

		return languages.reduce((active, language) => {
			const languageSettings: LanguageSettings = languagesSettings[language];
			return active || languageSettings.streamParameters.streamActive;
		}, false);
	}, [languagesSettings]);

	const languagesCount = useMemo(() => {
		return Object.keys(languagesSettings).length;
	}, [languagesSettings]);

	return (
		<button
			className={streamsActive ? "btn btn-danger" : "btn btn-success"}
			title={(streamsActive ? "Stop" : "Start") + " streaming of all languages"}
			onClick={() => {
				if (streamsActive) {
					if (window.confirm("❗️ Stop all streams?") === true) {
						stopStreaming();
					}
				} else {
					startStreaming();
				}
			}}
		>
			<i className="bi bi-broadcast" />
			<span>
				{streamsActive ? "Stop" : "Start"} streaming ({languagesCount} langs)
			</span>
		</button>
	);
};

export default StartStopStreamingButton;
