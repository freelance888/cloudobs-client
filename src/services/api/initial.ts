import { LangMap, GlobalSettings, LanguagesSettings, SheetInitialSettings } from "../types";

import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_INIT = "/init";
const API_URL_INFO = "/info";

/**
 * POST /init
 * Use Google Spreadsheet data source
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-init
 */
export const postInit: ApiCall<SheetInitialSettings, LanguagesSettings> = ({ sheetUrl, worksheetName }) => {
	const data = {
		sheet_url: sheetUrl,
		worksheet_name: worksheetName,
		force_deploy_minions: true,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_INIT,
		data,
		messages: {
			success: "Init successful",
			error: "Init failed",
		},
	});
};

/**
 * GET /info
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-info
 */

export const getInfo: ApiCall<void, LangMap<GlobalSettings>> = () => {
	return sendRequest({
		url: API_URL_INFO,
		messages: {
			success: "Initial data fetched",
			error: "Initial data fetching failed",
		},
	});
};
