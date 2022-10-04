import { NewVMixPlayer, VMixPlayer } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_VMIX_PLAYERS = "/vmix/players";
const API_URL_VMIX_PLAYERS_ACTIVE = "/vmix/players/active";

/**
 * GET /vmix/players
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-vmixplayers
 */
export const getVMixPlayers: ApiCall<void, VMixPlayer[]> = () => {
	return sendRequest({
		url: API_URL_VMIX_PLAYERS,
		messages: {
			success: "vMix players fetched",
			error: "vMix players fetching failed",
		},
	});
};

/**
 * POST /vmix/players
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-vmixplayers
 */
export const postVMixPlayers: ApiCall<NewVMixPlayer[]> = (vMixPlayers) => {
	const data = {
		ip_list: vMixPlayers,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_VMIX_PLAYERS,
		data,
		messages: {
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		dataToReturn: vMixPlayers,
	});
};

/**
 * GET /vmix/players
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-vmixplayersactive
 */
export const getVMixPlayersActive: ApiCall<void, string | "*"> = () => {
	return sendRequest({
		url: API_URL_VMIX_PLAYERS_ACTIVE,
		messages: {
			success: "Active vMix player fetched",
			error: "Active vMix player fetching failed",
		},
	});
};

/**
 * POST /vmix/players/active
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-vmixplayersactive
 */
export const postVMixPlayersActive: ApiCall<string | "*"> = (vMixPlayer) => {
	const data = {
		ip: vMixPlayer,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_VMIX_PLAYERS_ACTIVE,
		data,
		messages: {
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		dataToReturn: vMixPlayer,
	});
};
