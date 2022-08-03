/**
 * Implementation of
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md
 */
import {
	All,
	GDriveSettings,
	GlobalSettings,
	InitialSettings,
	MediaPlaySettings,
	SidechainSettings,
	SourceVolumeSettings,
	StreamDestinationSettings,
	TransitionSettings,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
	VideoSchedule,
} from "./types";
import { sendGetRequest, sendPostRequest } from "./utils";

const API_URL_INIT = "/init";
const API_URL_INFO = "/info";
const API_URL_CLEANUP = "/cleanup";
const API_URL_MEDIA_PLAY = "/media/play";
const API_URL_MEDIA_SCHEDULE = "/media/schedule";
const API_URL_STREAM_SETTINGS = "/stream/settings";
const API_URL_STREAM_START = "/stream/start";
const API_URL_STREAM_STOP = "/stream/stop";
const API_URL_TS_OFFSET = "/ts/offset";
const API_URL_TS_VOLUME = "/ts/volume";
const API_URL_SOURCE_VOLUME = "/source/volume";
const API_URL_FILTERS_SIDECHAIN = "/filters/sidechain";
const API_URL_TRANSITION = "/transition";
const API_URL_GDRIVE_SYNC = "/gdrive/sync";

export type ApiResult<T extends {} = {}> = {
	status: "success" | "error";
	data: T;
	messages: {
		success?: string;
		error?: string;
	};
};

const processResponse = async <T extends {} = {}>(
	responsePromise: Promise<Response>,
	messages?: {
		success?: string;
		error?: string;
	}
): Promise<ApiResult<T>> => {
	try {
		const response = await responsePromise;

		if (response.status === 200) {
			let data: T = {} as T;
			try {
				data = await response.json();
			} catch (error) {}
			const message = messages?.success || "Success";

			console.info(message);

			return { status: "success", data, messages: { success: message } };
		} else {
			const data: T = {} as T;
			const message = await response.text();

			console.error(message);

			return { status: "error", data, messages: { error: message } };
		}
	} catch (error) {
		const data: T = {} as T;
		const message = String(error);

		console.error(message);

		return { status: "error", data, messages: { error: message } };
	}
};

/**
 * POST /init
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-init
 */
export const postInit = (initialSettings: All<InitialSettings>): Promise<ApiResult> => {
	const data = {
		server_langs: initialSettings,
	};

	return processResponse(sendPostRequest(API_URL_INIT, data, 3000), {
		success: "Init successful",
		error: "Init failed",
	});
};

/**
 * POST /init
 * Use Google Spreadsheet data source
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-init
 */
export const postInitV2 = ({
	sheetUrl,
	worksheetName,
}: {
	sheetUrl: string;
	worksheetName: string;
}): Promise<ApiResult> => {
	const data = {
		sheet_url: sheetUrl,
		worksheet_name: worksheetName,
	};

	return processResponse(sendPostRequest(API_URL_INIT, data, 3000), {
		success: "Init successful",
		error: "Init failed",
	});
};

/**
 * GET /init
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#get-init
 */

export const getInit = (): Promise<ApiResult<All<InitialSettings>>> => {
	return processResponse(sendGetRequest(API_URL_INIT), {
		success: "Initial data fetched",
		error: "Initial data fetching failed",
	});
};

/**
 * GET /info
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#get-info
 */

export const getInfo = (): Promise<ApiResult<All<GlobalSettings>>> => {
	return processResponse(sendGetRequest(API_URL_INFO), {
		success: "Initial data fetched",
		error: "Initial data fetching failed",
	});
};

/**
 * POST /cleanup
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-cleanup
 */
export const postCleanup = (): Promise<ApiResult> => {
	return processResponse(sendPostRequest(API_URL_CLEANUP), {
		success: "Cleanup successful",
		error: "Cleanup failed",
	});
};

/**
 * POST /media/play
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-mediaplay
 */
export const postMediaPlay = (mediaPlaySettings: All<MediaPlaySettings>): Promise<ApiResult> => {
	const data = {
		params: mediaPlaySettings,
	};

	return processResponse(sendPostRequest(API_URL_MEDIA_PLAY, data));
};

/**
 * POST /stream/settings
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamsettings
 */
export const postStreamSettings = (streamSettings: All<StreamDestinationSettings>): Promise<ApiResult> => {
	const data = {
		stream_settings: streamSettings,
	};

	return processResponse(sendPostRequest(API_URL_STREAM_SETTINGS, data), {
		success: "Set stream settings successful",
		error: "Set stream settings failed",
	});
};

/**
 * POST /stream/start
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamstart
 */
export const postStreamStart = (languages: string[] = ["__all__"]): Promise<ApiResult> => {
	const data = {
		langs: languages,
	};

	return processResponse(sendPostRequest(API_URL_STREAM_START, data), {
		success: "Streams started",
		error: "Stream start failed",
	});
};

/**
 * POST /stream/stop
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamstop
 */
export const postStreamStop = (languages: string[] = ["__all__"]): Promise<ApiResult> => {
	const data = {
		langs: languages,
	};

	return processResponse(sendPostRequest(API_URL_STREAM_STOP, data), {
		success: "Streams stopped",
		error: "Stream stop failed",
	});
};

/**
 * POST /ts/offset
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-tsoffset
 */
export const postTsOffset = (offsetSettings: All<TranslationOffsetSettings>): Promise<ApiResult> => {
	const data = {
		offset_settings: offsetSettings,
	};

	return processResponse(sendPostRequest(API_URL_TS_OFFSET, data), {
		success: `Translation offset set: ${Object.values(offsetSettings)?.[0]}`,
		error: "Translation offset setting failed",
	});
};

/**
 * GET /ts/offset
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#get-tsoffset
 */
export const getTsOffset = (): Promise<ApiResult<All<TranslationOffsetSettings>>> => {
	return processResponse(sendGetRequest(API_URL_TS_OFFSET), {
		success: "Translation offsets fetched",
		error: "Translation offsets fetching failed",
	});
};

/**
 * POST /ts/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-tsvolume
 */
export const postTsVolume = (volumeSettings: All<TranslationVolumeSettings>): Promise<ApiResult> => {
	const data = {
		volume_settings: volumeSettings,
	};

	return processResponse(sendPostRequest(API_URL_TS_VOLUME, data), {
		success: `Translation volume set: ${Object.values(volumeSettings)?.[0]}`,
		error: "Translation volume setting failed",
	});
};

/**
 * GET /ts/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#get-tsvolume
 */
export const getTsVolume = (): Promise<ApiResult<All<TranslationVolumeSettings>>> => {
	return processResponse(sendGetRequest(API_URL_TS_VOLUME), {
		success: "Translation volumes fetched",
		error: "Translation volumes fetching failed",
	});
};

/**
 * POST /source/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-sourcevolume
 */
export const postSourceVolume = (volumeSettings: All<SourceVolumeSettings>): Promise<ApiResult> => {
	const data = {
		volume_settings: volumeSettings,
	};

	return processResponse(sendPostRequest(API_URL_SOURCE_VOLUME, data), {
		success: `Source volume set: ${Object.values(volumeSettings)?.[0]}`,
		error: "Source volume setting failed",
	});
};

/**
 * GET /source/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#get-sourcevolume
 */
export const getSourceVolume = (): Promise<ApiResult<All<SourceVolumeSettings>>> => {
	return processResponse(sendGetRequest(API_URL_SOURCE_VOLUME), {
		success: "Source volumes fetched",
		error: "Source volumes fetching failed",
	});
};

/**
 * POST /filters/sidechain
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-filterssidechain
 */
export const postUpdateFiltersSidechain = (sidechainSettings: All<Partial<SidechainSettings>>): Promise<ApiResult> => {
	const data = {
		sidechain_settings: sidechainSettings,
	};

	return processResponse(sendPostRequest(API_URL_FILTERS_SIDECHAIN, data), {
		success: `Sidechain set: ${JSON.stringify(sidechainSettings)}`,
		error: "Sidechain setting failed",
	});
};

/**
 * POST /transition
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-transition
 */
export const postTransition = (transitionSettings: All<TransitionSettings>): Promise<ApiResult> => {
	const data = {
		transition_settings: transitionSettings,
	};

	return processResponse(sendPostRequest(API_URL_TRANSITION, data));
};

/**
 * POST /gdrive/sync
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-gdrivesync
 */
export const postGDriveSync = (gDriveSettings: All<GDriveSettings>): Promise<ApiResult> => {
	const data = {
		gdrive_settings: gDriveSettings,
	};

	return processResponse(sendPostRequest(API_URL_GDRIVE_SYNC, data), {
		success: "Google Drive synced",
		error: "Google Drive sync failed",
	});
};

export const postMediaSchedule = (videoSchedule: VideoSchedule): Promise<ApiResult> => {
	const data = {
		schedule: videoSchedule.map(({ name, secondsFromStart }) => [name, secondsFromStart]),
	};

	return processResponse(sendPostRequest(API_URL_MEDIA_SCHEDULE, data), {
		success: "Media schedule set",
		error: "Media schedule setting failed",
	});
};
