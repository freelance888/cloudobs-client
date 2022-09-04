import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LanguageSettings from "./components/screens/live/LanguageSettings";
import StatusBar from "./components/StatusBar";
import InitializationSettings from "./components/screens/initialization/InitializationSettings";
import { fetchLanguagesSettings, selectInitialLanguagesSettingsLoaded } from "./store/slices/app";
import { fetchMediaSchedule } from "./store/slices/media-schedule";
import MediaScheduleSettings from "./components/screens/media-schedule/MediaScheduleSettings";
import NavigationBar from "./components/NavigationBar";
import EnvironmentSettings from "./components/screens/environment/EnvironmentSettings";
import AppLogs from "./components/screens/logs/AppLogs";
import { fetchVMixPlayers } from "./store/slices/environment";

import "./App.css";

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
				<Route path="/videos" element={<MediaScheduleSettings />} />
				<Route path="/environment" element={<EnvironmentSettings />} />
				<Route path="/logs" element={<AppLogs />} />
			</Routes>

			<StatusBar />
		</div>
	);
};

export default App;
