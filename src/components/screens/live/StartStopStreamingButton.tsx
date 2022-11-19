import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LanguageSettings } from "../../../services/types";
import { stopStreaming, startStreaming, selectLanguagesSettings, selectActiveRequest } from "../../../store/slices/app";

const StartStopStreamingButton = () => {
	const dispatch = useDispatch();
	const activeRequest = useSelector(selectActiveRequest);
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
			disabled={languagesCount === 0 || activeRequest === "postStreamStart" || activeRequest === "postStreamStop"}
			onClick={() => {
				if (streamsActive) {
					if (window.confirm("❗️ Stop all streams?") === true) {
						dispatch(stopStreaming() as any);
					}
				} else {
					dispatch(startStreaming() as any);
				}
			}}
		>
			<i className={activeRequest === "postStreamStop" ? "bi bi-arrow-clockwise spin" : "bi bi-broadcast"} />
			<span>
				{streamsActive ? "Stop" : "Start"} streaming ({languagesCount} langs)
			</span>
		</button>
	);
};

export default StartStopStreamingButton;
