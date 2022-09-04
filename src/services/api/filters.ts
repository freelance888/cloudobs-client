import { All, SidechainSettings } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_FILTERS_SIDECHAIN = "/filters/sidechain";

/**
 * POST /filters/sidechain
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-filterssidechain
 */
export const postUpdateFiltersSidechain: ApiCall<All<Partial<SidechainSettings>>> = (sidechainSettings) => {
	const data = {
		sidechain_settings: sidechainSettings,
	};

	return processResponse(
		sendRequest("POST", API_URL_FILTERS_SIDECHAIN, data),
		{
			success: `Sidechain set: ${JSON.stringify(sidechainSettings)}`,
			error: "Sidechain setting failed",
		},
		sidechainSettings
	);
};
