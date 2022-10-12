import { useEffect, useState } from "react";
import { getServerState, ServerState } from "../services/api/state";

const useServerStatePoller = () => {
	const [serverReady, setServerReady] = useState<boolean>(false);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		const clearPolling = () => {
			interval && clearInterval(interval);
		};

		const checkState = async () => {
			const serverState = await getServerState();
			const ready = serverState === ServerState.RUNNING;

			if (ready) {
				clearPolling();
			}

			setServerReady(ready);
		};

		checkState();

		interval = setInterval(() => {
			checkState();
		}, 5000);

		return clearPolling;
	}, []);

	return serverReady;
};

export default useServerStatePoller;
