import { useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
	selectInitialLanguagesSettingsLoaded,
	selectInitialized,
	selectLanguagesSettings,
	refreshServers,
	refreshSource,
} from "../../../store/slices/app";
import ContentPanel from "../../ContentPanel";
import StopMediaButton from "../../StopMediaButton";
import { AppDispatch } from "../../../store/store";

import Language from "./Language";
import LanguageFilter from "./LanguageFilter";
import StartStopStreamingButton from "./StartStopStreamingButton";

const LanguageSettings = () => {
	const dispatch = useDispatch<AppDispatch>();

	const loaded = useSelector(selectInitialLanguagesSettingsLoaded);
	const initialized = useSelector(selectInitialized);
	const languagesSettings = useSelector(selectLanguagesSettings);

	const languagesCount = useMemo(() => Object.keys(languagesSettings).length, [languagesSettings]);

	const [collapsedStates, setCollapsedStates] = useState({});
	const [languageFilter, setLanguageFilter] = useState<string>("");

	return (
		<ContentPanel
			mainActions={
				languagesCount > 0 && (
					<>
						<button
							className="btn btn-info me-2"
							title="Refresh servers data from spreadsheet table and update UI"
							onClick={() => {
								dispatch(refreshServers());
							}}
						>
							<i className="bi bi-arrow-clockwise" />
							<span>Refresh from sheet</span>
						</button>
						{initialized && <StartStopStreamingButton />}
						<button
							className="btn btn-dark ms-2"
							onClick={() => {
								if (window.confirm("Are you sure?") === true) {
									dispatch(refreshSource(["__all__"]));
								}
							}}
						>
							<i className={"bi bi-eye"} />
							Refresh all sources
						</button>
						<StopMediaButton class="ms-2" />
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
				<>
					<hr />
					<div className="mb-4">
						<LanguageFilter value={languageFilter} onValueChanged={setLanguageFilter} />
					</div>
					{Object.entries(languagesSettings)
						.filter(([language]) => {
							return language.toLowerCase().includes(languageFilter.toLowerCase());
						})
						.map(([language, settings]) => (
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
						))}
				</>
			)}
		</ContentPanel>
	);
};

export default LanguageSettings;
