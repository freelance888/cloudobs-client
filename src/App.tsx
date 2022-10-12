import React from "react";
import useServerStatePoller from "./hooks/useServerStatePoller";
import useInitialization from "./hooks/useInitialization";
import AppContentScreen from "./components/screens/AppContentScreen";
import VideoTableInitSettings from "./components/screens/initialization/VideoTableInitSettings";
import "./App.css";

const App: React.FC = () => {
	const ready = useServerStatePoller();

	useInitialization(ready);

	return <div className="App">{ready ? <AppContentScreen /> : <VideoTableInitSettings />}</div>;
};

export default App;
