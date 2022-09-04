import { All, SourceVolumeSettings } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_SOURCE_VOLUME = "/source/volume";

/**
 * POST /source/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-sourcevolume
 */
export const postSourceVolume: ApiCall<All<SourceVolumeSettings>> = (volumeSettings) => {
	const data = {
		volume_settings: volumeSettings,
	};

	return processResponse(
		sendRequest("POST", API_URL_SOURCE_VOLUME, data),
		{
			success: `Source volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Source volume setting failed",
		},
		volumeSettings
	);
};
