import { All, SourceVolumeSettings } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_SOURCE_VOLUME = "/source/volume";

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
