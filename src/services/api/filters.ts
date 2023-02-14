import { LangMap, SidechainSettings } from "../types";

import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_FILTERS_SIDECHAIN = "/filters/sidechain";

/**
 * POST /filters/sidechain
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-filterssidechain
 */
export const postUpdateFiltersSidechain: ApiCall<LangMap<Partial<SidechainSettings>>> = (sidechainSettings) => {
	const data = {
		sidechain_settings: sidechainSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_FILTERS_SIDECHAIN,
		messages: {
			success: `Sidechain set: ${JSON.stringify(sidechainSettings)}`,
			error: "Sidechain setting failed",
		},
		data,
		dataToReturn: sidechainSettings,
	});
};
