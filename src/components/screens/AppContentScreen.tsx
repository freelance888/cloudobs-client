import { Route, Routes } from "react-router-dom";

import NavigationBar, {
	STREAM_CHECK,
	URL_PATH_ENVIRONMENT,
	URL_PATH_LIVE,
	URL_PATH_LOGS,
	URL_PATH_TIMING,
} from "../NavigationBar";
import StatusBar from "../StatusBar";

import AppLogs from "./app-logs/AppLogs";
import EnvironmentSettings from "./environment/EnvironmentSettings";
import LanguageSettings from "./live/LanguageSettings";
import TimingSettings from "./timing/TimingSettings";
import StreamCheck from "./stream-check/StreamCheck";

const AppContentScreen: React.FC = () => {
	return (
		<>
			<NavigationBar />

			<Routes>
				<Route path={URL_PATH_LIVE} element={<LanguageSettings />} />
				<Route path={URL_PATH_TIMING} element={<TimingSettings />} />
				<Route path={URL_PATH_ENVIRONMENT} element={<EnvironmentSettings />} />
				<Route path={URL_PATH_LOGS} element={<AppLogs />} />
				<Route path={STREAM_CHECK} element={<StreamCheck />} />
			</Routes>

			<StatusBar />
		</>
	);
};

export default AppContentScreen;
