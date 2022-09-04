import { NewVMixPlayer, VMixPlayer } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_VMIX_PLAYERS = "/vmix/players";
const API_URL_VMIX_PLAYERS_ACTIVE = "/vmix/players/active";

/**
 * GET /vmix/players
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-vmixplayers
 */
export const getVMixPlayers: ApiCall<void, VMixPlayer[]> = () => {
	return processResponse(sendRequest("GET", API_URL_VMIX_PLAYERS), {
		success: "vMix players fetched",
		error: "vMix players fetching failed",
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

	return processResponse(
		sendRequest("POST", API_URL_VMIX_PLAYERS, data),
		{
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		vMixPlayers
	);
};

/**
 * GET /vmix/players
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-vmixplayersactive
 */
export const getVMixPlayersActive: ApiCall<void, string | "*"> = () => {
	return processResponse(sendRequest("GET", API_URL_VMIX_PLAYERS_ACTIVE), {
		success: "Active vMix player fetched",
		error: "Active vMix player fetching failed",
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

	return processResponse(
		sendRequest("POST", API_URL_VMIX_PLAYERS_ACTIVE, data),
		{
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		vMixPlayer
	);
};
