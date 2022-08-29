/**
 * Implementation of
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md
 */
import {
	All,
	GDriveSettings,
	GlobalSettings,
	InitialSettings,
	LanguagesSettings,
	MediaPlaySettings,
	SheetInitialSettings,
	SidechainSettings,
	SourceVolumeSettings,
	StreamDestinationSettings,
	TransitionSettings,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
	VideoSchedule,
	VMixPlayers,
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
const API_URL_VMIX_PLAYERS = "/vmix/players";
const API_URL_VMIX_PLAYERS_ACTIVE = "/vmix/players/active";

export type ApiResult<T extends {} = {}> = {
	status: "success" | "error";
	message: string;
	data?: T;
};

type ApiCall<T extends Record<string, unknown> | unknown[], U = T> = (param: T) => Promise<ApiResult<U>>;

const processResponse = async <T extends {} = {}>(
	responsePromise: Promise<Response>,
	messages: {
		success: string;
		error: string;
	},
	dataToReturn?: T
): Promise<ApiResult<T>> => {
	let data: T = {} as T;
	const { success } = messages;

	try {
		const response = await responsePromise;

		// Failed request
		if (!response.status) {
			const message = (response as any).message;
			return { status: "error", message };
		}
		// Successful request
		else if (response.status === 200) {
			try {
				data = await response.json();
			} catch (error) {}
			return { status: "success", message: success, data: dataToReturn ?? data };
		}
		// Error response
		else {
			const message = await response.text();
			return { status: "error", message };
		}
	} catch (error) {
		return { status: "error", message: String(error) };
	}
};

/**
 * POST /init
 * Use Google Spreadsheet data source
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-init
 */
export const postInit: ApiCall<SheetInitialSettings, LanguagesSettings> = ({ sheetUrl, worksheetName }) => {
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

	return processResponse(sendPostRequest(API_URL_MEDIA_PLAY, data), {
		success: "Video successfully played",
		error: "Video play failed",
	});
};

/**
 * POST /stream/settings
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamsettings
 */
export const postStreamSettings: ApiCall<All<StreamDestinationSettings>> = (streamSettings) => {
	const data = {
		stream_settings: streamSettings,
	};

	return processResponse(
		sendPostRequest(API_URL_STREAM_SETTINGS, data),
		{
			success: "Set stream settings successful",
			error: "Set stream settings failed",
		},
		streamSettings
	);
};

/**
 * POST /stream/start
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamstart
 */
export const postStreamStart: ApiCall<string[]> = (languages = ["__all__"]) => {
	const data = {
		langs: languages,
	};

	return processResponse(
		sendPostRequest(API_URL_STREAM_START, data),
		{
			success: "Streams started",
			error: "Stream start failed",
		},
		languages
	);
};

/**
 * POST /stream/stop
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-streamstop
 */
export const postStreamStop: ApiCall<string[]> = (languages = ["__all__"]) => {
	const data = {
		langs: languages,
	};

	return processResponse(
		sendPostRequest(API_URL_STREAM_STOP, data),
		{
			success: "Streams stopped",
			error: "Stream stop failed",
		},
		languages
	);
};

/**
 * POST /ts/offset
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-tsoffset
 */
export const postTsOffset: ApiCall<All<TranslationOffsetSettings>> = (offsetSettings) => {
	const data = {
		offset_settings: offsetSettings,
	};

	return processResponse(
		sendPostRequest(API_URL_TS_OFFSET, data),
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
		sendPostRequest(API_URL_TS_VOLUME, data),
		{
			success: `Translation volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Translation volume setting failed",
		},
		volumeSettings
	);
};

/**
 * POST /source/volume
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-sourcevolume
 */
export const postSourceVolume: ApiCall<All<SourceVolumeSettings>> = (volumeSettings) => {
	const data = {
		volume_settings: volumeSettings,
	};

	return processResponse(
		sendPostRequest(API_URL_SOURCE_VOLUME, data),
		{
			success: `Source volume set: ${Object.values(volumeSettings)?.[0]}`,
			error: "Source volume setting failed",
		},
		volumeSettings
	);
};

/**
 * POST /filters/sidechain
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-filterssidechain
 */
export const postUpdateFiltersSidechain: ApiCall<All<Partial<SidechainSettings>>> = (sidechainSettings) => {
	const data = {
		sidechain_settings: sidechainSettings,
	};

	return processResponse(
		sendPostRequest(API_URL_FILTERS_SIDECHAIN, data),
		{
			success: `Sidechain set: ${JSON.stringify(sidechainSettings)}`,
			error: "Sidechain setting failed",
		},
		sidechainSettings
	);
};

/**
 * POST /transition
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-transition
 */
export const postTransition = (transitionSettings: All<TransitionSettings>): Promise<ApiResult> => {
	const data = {
		transition_settings: transitionSettings,
	};

	return processResponse(sendPostRequest(API_URL_TRANSITION, data), {
		success: "Transition complete",
		error: "Transition failed",
	});
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

export const getVMixPlayers = (): Promise<ApiResult<VMixPlayers>> => {
	return processResponse(sendGetRequest(API_URL_VMIX_PLAYERS), {
		success: "vMix players fetched",
		error: "vMix players fetching failed",
	});
};

export const postVMixPlayers = (vMixPlayers: string[]): Promise<ApiResult<string[]>> => {
	const data = {
		ip_list: vMixPlayers,
	};

	return processResponse(
		sendPostRequest(API_URL_VMIX_PLAYERS, data),
		{
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		vMixPlayers
	);
};

export const getVMixPlayersActive = (): Promise<ApiResult<string | "*">> => {
	return processResponse(sendGetRequest(API_URL_VMIX_PLAYERS_ACTIVE), {
		success: "Active vMix player fetched",
		error: "Active vMix player fetching failed",
	});
};

export const postVMixPlayersActive = (vMixPlayer: string | "*"): Promise<ApiResult<string | "*">> => {
	const data = {
		ip: vMixPlayer,
	};

	return processResponse(
		sendPostRequest(API_URL_VMIX_PLAYERS_ACTIVE, data, undefined, true),
		{
			success: "vMix players set",
			error: "vMix players setting failed",
		},
		vMixPlayer
	);
};
