import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import { selectIsRegistryLoaded, selectRegistry } from "./store/slices/registry";
import useInitSocket from "./hooks/useInitSocket";
import { ServerStatus } from "./services/types";
import Connecting from "./components/screens/Connecting";
import Initialization from "./components/screens/Initialization";
import AppContentScreen from "./components/screens/AppContentScreen";

const App: React.FC = () => {
	useInitSocket();

	const registryLoaded = useSelector(selectIsRegistryLoaded);
	const registry = useSelector(selectRegistry);

	if (!registryLoaded) {
		return <Connecting />;
	}

	console.log("### REGISTRY", registry);

	switch (registry.server_status) {
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
