import { Fragment, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { selectRegistry } from "../../../store/slices/registry";
import ContentPanel from "../../ContentPanel";
import StopMediaButton from "../../StopMediaButton";
import { Registry, ServerStatus } from "../../../services/types";
import { pullConfig, refreshSource } from "../../../services/socketApi";

import Language from "./Language";
import LanguageFilter from "./LanguageFilter";
import StartStopStreamingButton from "./StartStopStreamingButton";

const LanguageSettings = () => {
	const registry: Registry = useSelector(selectRegistry);
	const languagesSettings = registry?.minion_configs;

	const initialized = registry.server_status === ServerStatus.RUNNING;
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
								pullConfig();
							}}
						>
							<i className="bi bi-arrow-clockwise" />
							<span>Refresh from sheet</span>
						</button>
						{initialized && <StartStopStreamingButton />}
						<button
							className="btn btn-dark ms-2"
							title="Refreshes original media source for all languages"
							onClick={() => {
								if (window.confirm("Are you sure?")) {
									refreshSource();
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
								const isAllCollapsed =
									Object.values(collapsedStates).length > 0 &&
									Object.values(collapsedStates).every((isLanguageCollapsed) => isLanguageCollapsed);
								const updated = Object.fromEntries(
									Object.keys(languagesSettings).map((lang) => [lang, !isAllCollapsed])
								);
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
			) : (
				<>
					{languagesCount > 0 && (
						<Fragment>
							<hr />
							<div className="mb-4">
								<LanguageFilter value={languageFilter} onValueChanged={setLanguageFilter} />
							</div>
						</Fragment>
					)}
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
								videosData={registry.gdrive_files[language] || {}}
							/>
						))}
				</>
			)}
		</ContentPanel>
	);
};

export default LanguageSettings;
