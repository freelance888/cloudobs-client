import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguagesSettings, selectInitialLanguagesSettingsLoaded } from "./store/slices/app";
import { fetchVMixPlayers } from "./store/slices/environment";

import "./App.css";
import { isServerSleeping } from "./services/api/sleeping";
import AppContentScreen from "./components/screens/AppContentScreen";
import VideoTableInitSettings from "./components/screens/initialization/VideoTableInitSettings";

const App: React.FC = () => {
	const dispatch = useDispatch();

	const loaded = useSelector(selectInitialLanguagesSettingsLoaded);
	const [serverSleeping, setServerSleeping] = useState<boolean | null>(null);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		const checkSleeping = async () => {
			const serverSleeping = await isServerSleeping();

			if (!serverSleeping) {
				interval && clearInterval(interval);
			}

			setServerSleeping(serverSleeping);
		};

		interval = setInterval(() => {
			checkSleeping();
		}, 5000);

		checkSleeping();

		return () => {
			interval && clearInterval(interval);
		};
	}, []);

	if (!loaded || serverSleeping === null) {
		<div className="App">Loading...</div>;
	}

	useEffect(() => {
		if (serverSleeping === false) {
			dispatch(fetchLanguagesSettings() as any);
			dispatch(fetchVMixPlayers() as any);
		}
	}, [dispatch, serverSleeping]);

	return <div className="App">{serverSleeping ? <VideoTableInitSettings /> : <AppContentScreen />}</div>;
};

export default App;
