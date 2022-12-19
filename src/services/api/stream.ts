import { All, StreamDestinationSettings } from "../types";

import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_STREAM_SETTINGS = "/stream/settings";
const API_URL_STREAM_START = "/stream/start";
const API_URL_STREAM_STOP = "/stream/stop";

/**
 * POST /stream/settings
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-streamsettings
 */
export const postStreamSettings: ApiCall<All<StreamDestinationSettings>> = (streamSettings) => {
	const data = {
		stream_settings: streamSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_STREAM_SETTINGS,
		data,
		messages: {
			success: "Set stream settings successful",
			error: "Set stream settings failed",
		},
		dataToReturn: streamSettings,
	});
};

/**
 * POST /stream/start
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-streamstart
 */
export const postStreamStart: ApiCall<string[]> = (languages = ["__all__"]) => {
	const data = {
		langs: languages,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_STREAM_START,
		data,
		messages: {
			success: "Streams started",
			error: "Stream start failed",
		},
		dataToReturn: languages,
	});
};

/**
 * POST /stream/stop
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-streamstop
 */
export const postStreamStop: ApiCall<string[]> = (languages = ["__all__"]) => {
	const data = {
		langs: languages,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_STREAM_STOP,
		data,
		messages: {
			success: "Streams stopped",
			error: "Stream stop failed",
		},
		dataToReturn: languages,
	});
};
