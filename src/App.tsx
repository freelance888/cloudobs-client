import React, { useEffect } from "react";
import LanguageSettings from "./components/LanguageSettings";
import StatusBar from "./components/StatusBar";
import InitializationSettings from "./components/InitializationSettings";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguagesSettings, fetchMediaSchedule, selectInitialLanguagesSettingsLoaded } from "./store/slices/app";
import VideoSchedule from "./components/VideoSchedule";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import EnvironmentSettings from "./components/EnvironmentSettings";
import AppLogs from "./components/Logs";
import { fetchVMixPlayers } from "./store/slices/environment";

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
		dispatch(fetchMediaSchedule() as any);
		dispatch(fetchVMixPlayers() as any);
	}, [dispatch]);

	if (!loaded) {
		<div className="App">Loading...</div>;
	}

	return (
		<div className="App">
			<NavigationBar />

			<Routes>
				<Route path="/" element={<LanguageSettings />} />
				<Route path="/settings" element={<InitializationSettings />} />
				<Route path="/videos" element={<VideoSchedule />} />
				<Route path="/environment" element={<EnvironmentSettings />} />
				<Route path="/logs" element={<AppLogs />} />
			</Routes>

			<StatusBar />
		</div>
	);
};

export default App;
