import { useEffect, useState } from "react";

import { getServerState, ServerState } from "../services/api/state";

const POLL_INTERVAL_MS = 5000;

const useServerStatePoller = () => {
	const [serverState, setServerState] = useState<ServerState | null>(null);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		const clearPolling = () => {
			interval && clearInterval(interval);
		};

		const checkState = async () => {
			const serverState = await getServerState();
			setServerState(serverState);
		};

		checkState();

		interval = setInterval(() => {
			checkState();
		}, POLL_INTERVAL_MS);

		return clearPolling;
	}, []);

	return serverState;
};

export default useServerStatePoller;
