import React from "react";

import useServerStatePoller from "./hooks/useServerStatePoller";
import useInitialization from "./hooks/useInitialization";
import AppContentScreen from "./components/screens/AppContentScreen";
import VideoTableInitSettings from "./components/screens/initialization/VideoTableInitSettings";
import "./App.css";
import { ServerState } from "./services/api/state";

const App: React.FC = () => {
	const serverState = useServerStatePoller();

	useInitialization(serverState === ServerState.RUNNING);

	switch (serverState) {
		case ServerState.INITIALIZING:
			return <div>Initializing... Please wait 🙂</div>;
		case ServerState.RUNNING:
			return <AppContentScreen />;
		case ServerState.DISPOSING:
			return <div>Server is being disposed...</div>;
		default:
			return <VideoTableInitSettings />;
	}
};

export default App;
