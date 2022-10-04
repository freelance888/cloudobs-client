import { All, GDriveFile, GDriveSettings } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_GDRIVE_SYNC = "/gdrive/sync";
const API_URL_GDRIVE_FILES = "/gdrive/files";

/**
 * POST /gdrive/sync
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-gdrivesync
 */
export const postGDriveSync: ApiCall<All<GDriveSettings>, never> = (gDriveSettings) => {
	const data = {
		gdrive_settings: gDriveSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_GDRIVE_SYNC,
		data,
		messages: {
			success: "Google Drive synced",
			error: "Google Drive sync failed",
		},
	});
};

/**
 * GET /gdrive/files
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-gdrivefiles
 */
export const getGDriveFiles: ApiCall<1 | 0, Record<"__all__", GDriveFile[]>> = (returnDetails) => {
	const data = {
		return_details: returnDetails,
	};

	return sendRequest({
		url: API_URL_GDRIVE_FILES,
		data,
		messages: {
			success: "Google Drive files fetched",
			error: "Google Drive files fetching failed",
		},
	});
};
