import { All, TranslationOffsetSettings, TranslationVolumeSettings } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_TS_OFFSET = "/ts/offset";
const API_URL_TS_VOLUME = "/ts/volume";

/**
 * POST /ts/offset
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-tsoffset
 */
export const postTsOffset: ApiCall<All<TranslationOffsetSettings>> = (offsetSettings) => {
	const data = {
		offset_settings: offsetSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_TS_OFFSET,
		data,
		messages: {
			success: `Translation offset set: ${Object.values(offsetSettings)?.[0]}`,
			error: "Translation offset setting failed",
		},
		dataToReturn: offsetSettings,
	});
};

/**
 * POST /ts/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-tsvolume
 */
export const postTsVolume: ApiCall<All<TranslationVolumeSettings>> = (volumeSettings) => {
	const data = {
		volume_settings: volumeSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_TS_VOLUME,
		data,
		messages: {
			success: `Translation volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Translation volume setting failed",
		},
		dataToReturn: volumeSettings,
	});
};
