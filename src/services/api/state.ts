import { buildUrl } from "../utils";

import { getHostAddress } from "./utils";

const SERVER_STATE_ENDPOINT = "/state";

export enum ServerStatus {
	SLEEPING = "sleeping",
	NOT_INITIALIZED = "not initialized",
	INITIALIZING = "initializing",
	RUNNING = "running",
	DISPOSING = "disposing",
}

export const getServerState: () => Promise<ServerStatus> = async () => {
	const url = buildUrl(getHostAddress(), SERVER_STATE_ENDPOINT);

	const response = await fetch(url);
	const serverState: ServerStatus = (await response.text()) as ServerStatus;

	return serverState;
};
