import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_SHEETS_PULL = "/sheets/pull";
// const API_URL_SHEETS_PUSH = "/sheets/push";

/**
 * POST /sheets/pull
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-sheetspull
 */
export const postSheetsPull: ApiCall<void, never> = () => {
	return sendRequest({
		method: "POST",
		url: API_URL_SHEETS_PULL,
		messages: {
			success: `Servers data refreshed`,
			error: "Servers data refreshing failed",
		},
	});
};
