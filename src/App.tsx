import React from "react";

import { useSelector } from "react-redux";

import AppContentScreen from "./components/screens/AppContentScreen";
import VideoTableInitSettings from "./components/screens/initialization/VideoTableInitSettings";
import "./App.css";
import { ServerStatus } from "./services/api/state";
import { selectRegistry } from "./store/slices/app";
import useInitSocket from "./hooks/useInitSocket";

const App: React.FC = () => {
	useInitSocket();
	const registry = useSelector(selectRegistry);
	const serverStatus = registry?.server_status;

	console.log("registry", registry);
	console.log("serverState", registry?.server_status);

	switch (serverStatus) {
		case ServerStatus.INITIALIZING:
			return <div>Initializing... Please wait 🙂</div>;
		case ServerStatus.RUNNING:
			return <AppContentScreen />;
		case ServerStatus.DISPOSING:
			return <div>Server is being disposed...</div>;
		default:
			return <VideoTableInitSettings />;
	}
};

export default App;
