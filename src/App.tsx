import React, { useCallback, useState } from "react";
import Controls from "./components/Controls";
import LanguageSettings from "./components/LanguageSettings";
import ServerUrlScreen from "./components/ServerUrlScreen";
import StatusBar from "./components/StatusBar";
import StreamSettings from "./components/StreamSettings";

import "./App.css";
import { useSelector } from "react-redux";
import { selectInitialLanguagesSettingsLoaded, selectLanguagesSettings } from "./store/slices/app";
import VideoSchedule from "./components/VideoSchedule";

export const MIN_TS_OFFSET = 0;
export const MAX_TS_OFFSET = 20000;
export const TS_OFFSET_STEP = 500;

export const MIN_TS_VOLUME = -100;
export const MAX_TS_VOLUME = 0;

export const MIN_SOURCE_VOLUME = -100;
export const MAX_SOURCE_VOLUME = 0;

const App: React.FC = () => {
	const [isServerUrlSelected, setIsServerUrlSelected] = useState(false);
	const [streamSettingsOpen, setStreamSettingsOpen] = useState(false);
	const [videoScheduleOpen, setVideoScheduleOpen] = useState(false);
	const loaded = useSelector(selectInitialLanguagesSettingsLoaded);

	const languagesSettings = useSelector(selectLanguagesSettings);

	const renderStreamSettings = useCallback(() => {
		return <StreamSettings onClose={() => setStreamSettingsOpen(false)} />;
	}, []);

	const renderLanguageSettings = useCallback(() => {
		return (
			<>
				<Controls
					onSetStreamSettingsClicked={() => {
						setStreamSettingsOpen(!streamSettingsOpen);
					}}
					onVideoScheduleClicked={() => {
						setVideoScheduleOpen(true);
					}}
					onGoogleDriveSyncClicked={() => {}}
				/>

				<LanguageSettings />
			</>
		);
	}, [streamSettingsOpen]);

	if (!isServerUrlSelected) {
		return <ServerUrlScreen onUrlSet={() => setIsServerUrlSelected(true)} />;
	}

	if (!loaded) {
		<div className="App">Loading...</div>;
	}

	return (
		<div className="App">
			{streamSettingsOpen || Object.keys(languagesSettings).length === 0 ? (
				renderStreamSettings()
			) : videoScheduleOpen ? (
				<VideoSchedule onClose={() => setVideoScheduleOpen(false)} />
			) : (
				renderLanguageSettings()
			)}
			<StatusBar />
		</div>
	);
};

export default App;
