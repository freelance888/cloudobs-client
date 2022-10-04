import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import StatusBar from "../StatusBar";
import AppLogs from "./app-logs/AppLogs";
import EnvironmentSettings from "./environment/EnvironmentSettings";
import LanguageSettings from "./live/LanguageSettings";
import MediaScheduleSettings from "./media-schedule/MediaScheduleSettings";

const AppContentScreen: React.FC = () => {
	return (
		<>
			<NavigationBar />

			<Routes>
				<Route path="/" element={<LanguageSettings />} />
				<Route path="/videos" element={<MediaScheduleSettings />} />
				<Route path="/environment" element={<EnvironmentSettings />} />
				<Route path="/logs" element={<AppLogs />} />
			</Routes>

			<StatusBar />
		</>
	);
};

export default AppContentScreen;
