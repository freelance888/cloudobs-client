import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchLanguagesSettings,
	selectInitialLanguagesSettingsLoaded,
	selectInitialized,
	selectLanguagesSettings,
	refreshServers,
	refreshSource,
} from "../../../store/slices/app";
import ContentPanel from "../../ContentPanel";
import Language from "./Language";
import StartStopStreamingButton from "./StartStopStreamingButton";

const LanguageSettings = () => {
	const dispatch = useDispatch();

	const loaded = useSelector(selectInitialLanguagesSettingsLoaded);
	const initialized = useSelector(selectInitialized);
	const languagesSettings = useSelector(selectLanguagesSettings);

	const languagesCount = useMemo(() => Object.keys(languagesSettings).length, [languagesSettings]);

	const [collapsedStates, setCollapsedStates] = useState({});

	return (
		<ContentPanel
			mainActions={
				languagesCount > 0 && (
					<>
						<button className="btn btn-primary me-2" onClick={() => dispatch(fetchLanguagesSettings() as any)}>
							<i className="bi bi-arrow-clockwise" />
							<span>Refresh</span>
						</button>
						<button
							className="btn btn-info me-2"
							title="Refresh servers data from spreadsheet table"
							onClick={() => {
								dispatch(refreshServers() as any);
							}}
						>
							<i className="bi bi-arrow-clockwise" />
							<span>Refresh from sheet</span>
						</button>
						{initialized && <StartStopStreamingButton />}
						<button
							className="btn btn-dark ms-2"
							onClick={() => {
								dispatch(refreshSource(["__all__"]) as any);
							}}
						>
							<i className={"bi bi-eye"} />
							Refresh all sources
						</button>
					</>
				)
			}
			endActions={
				initialized &&
				languagesCount > 0 && (
					<>
						<button
							className="btn btn-outline-info"
							onClick={() => {
								const updated = Object.keys(languagesSettings).reduce((obj, lang) => {
									obj[lang] = true;
									return obj;
								}, {});

								setCollapsedStates(updated);
							}}
						>
							<i className="bi bi-chevron-expand"></i>
							<span>Collapse all</span>
						</button>
					</>
				)
			}
			actionsOnTop
		>
			{!initialized ? (
				<div>Server is not initialized. Please, go to Stream Settings and initialize the server.</div>
			) : !loaded ? (
				"Loading..."
			) : (
				Object.entries(languagesSettings).map(([language, settings]) => (
					<Language
						key={language}
						language={language}
						languageSettings={settings}
						collapsed={collapsedStates[language]}
						onCollapsedToggled={() => {
							setCollapsedStates({
								...collapsedStates,
								[language]: !collapsedStates[language],
							});
						}}
					/>
				))
			)}
		</ContentPanel>
	);
};

export default LanguageSettings;
