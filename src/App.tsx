import React from "react";

import { useSelector } from "react-redux";

import AppContentScreen from "./components/screens/AppContentScreen";
import Initialization from "./components/screens/Initialization";
import Connecting from "./components/screens/Connecting";
import "./App.css";
import { selectRegistry } from "./store/slices/registry";
import useInitSocket from "./hooks/useInitSocket";
import { ServerStatus } from "./services/types";

const App: React.FC = () => {
	useInitSocket();

	const registry = useSelector(selectRegistry);
	const serverStatus = registry?.server_status;

	console.log("### REGISTRY", registry);

	switch (serverStatus) {
		case ServerStatus.INITIALIZING:
			return <div>Initializing... Please wait 🙂</div>;
		case ServerStatus.RUNNING:
			return <AppContentScreen />;
		case ServerStatus.DISPOSING:
			return <div>Server is being disposed...</div>;
		case ServerStatus.SLEEPING:
			return <Initialization />;
		default:
			return <Connecting />;
	}
};

export default App;
