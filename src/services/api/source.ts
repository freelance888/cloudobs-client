import { All, SourceVolumeSettings } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_SOURCE_VOLUME = "/source/volume";
const API_URL_SOURCE_REFRESH = "/source/refresh";

/**
 * POST /source/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-sourcevolume
 */
export const postSourceVolume: ApiCall<All<SourceVolumeSettings>> = (volumeSettings) => {
	const data = {
		volume_settings: volumeSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_SOURCE_VOLUME,
		data,
		messages: {
			success: `Source volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Source volume setting failed",
		},
		dataToReturn: volumeSettings,
	});
};

/**
 * PUT /source/refresh
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#put-sourcerefresh
 */
export const putSourceRefresh: ApiCall<string[]> = (languages = ["__all__"]) => {
	const data = {
		langs: languages,
	};

	return sendRequest({
		method: "PUT",
		url: API_URL_SOURCE_REFRESH,
		data,
		messages: {
			success: languages?.[0] === "__all__" ? `All sources refreshed` : `Source '${languages?.[0]}' refreshed`,
			error: "Source refreshing failed",
		},
		dataToReturn: languages,
	});
};
