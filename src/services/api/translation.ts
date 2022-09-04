import { All, TranslationOffsetSettings, TranslationVolumeSettings } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_TS_OFFSET = "/ts/offset";
const API_URL_TS_VOLUME = "/ts/volume";

/**
 * POST /ts/offset
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-tsoffset
 */
export const postTsOffset: ApiCall<All<TranslationOffsetSettings>> = (offsetSettings) => {
	const data = {
		offset_settings: offsetSettings,
	};

	return processResponse(
		sendRequest("POST", API_URL_TS_OFFSET, data),
		{
			success: `Translation offset set: ${Object.values(offsetSettings)?.[0]}`,
			error: "Translation offset setting failed",
		},
		offsetSettings
	);
};

/**
 * POST /ts/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-tsvolume
 */
export const postTsVolume: ApiCall<All<TranslationVolumeSettings>> = (volumeSettings) => {
	const data = {
		volume_settings: volumeSettings,
	};

	return processResponse(
		sendRequest("POST", API_URL_TS_VOLUME, data),
		{
			success: `Translation volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Translation volume setting failed",
		},
		volumeSettings
	);
};
