import React, { useEffect } from "react";
import LanguageSettings from "./components/LanguageSettings";
import StatusBar from "./components/StatusBar";
import StreamSettings from "./components/StreamSettings";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguagesSettings, selectInitialLanguagesSettingsLoaded } from "./store/slices/app";
import VideoSchedule from "./components/VideoSchedule";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import EnvironmentSettings from "./components/EnvironmentSettings";
import AppLogs from "./components/AppLogs";

export const MIN_TS_OFFSET = 0;
export const MAX_TS_OFFSET = 20000;
export const TS_OFFSET_STEP = 500;

export const MIN_TS_VOLUME = -100;
export const MAX_TS_VOLUME = 0;

export const MIN_SOURCE_VOLUME = -100;
export const MAX_SOURCE_VOLUME = 0;

const App: React.FC = () => {
	const dispatch = useDispatch();

	const loaded = useSelector(selectInitialLanguagesSettingsLoaded);

	useEffect(() => {
		dispatch(fetchLanguagesSettings() as any);
	}, [dispatch]);

	if (!loaded) {
		<div className="App">Loading...</div>;
	}

	return (
		<div className="App">
			<NavigationBar />

			<Routes>
				<Route path="/" element={<LanguageSettings />} />
				<Route path="/settings" element={<StreamSettings />} />
				<Route path="/videos" element={<VideoSchedule />} />
				<Route path="/environment" element={<EnvironmentSettings />} />
				<Route path="/logs" element={<AppLogs />} />
			</Routes>

			<StatusBar />
		</div>
	);
};

export default App;
