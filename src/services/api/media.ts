import {
	All,
	MediaPlaySettings,
	MediaSchedule,
	MediaScheduleStatus,
	NewMediaSchedule,
	SheetInitialSettings,
	UpdatedMediaScheduleItem,
} from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_MEDIA_PLAY = "/media/play";
const API_URL_MEDIA_SCHEDULE = "/media/schedule";
const API_URL_MEDIA_SCHEDULE_SETUP = "/media/schedule/setup";
const API_URL_MEDIA_SCHEDULE_PULL = "/media/schedule/pull";
const API_URL_MEDIA_SCHEDULE_STATUS = "/media/schedule/status";

/**
 * POST /media/play
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-mediaplay
 */
export const postMediaPlay: ApiCall<All<MediaPlaySettings>, never> = (mediaPlaySettings) => {
	const data = {
		params: mediaPlaySettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_MEDIA_PLAY,
		data,
		messages: {
			success: "Video successfully played",
			error: "Video play failed",
		},
	});
};

/**
 * DELETE /media/play
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#delete-mediaplay
 */
export const deleteMediaPlay: ApiCall<void, never> = () => {
	return sendRequest({
		method: "DELETE",
		url: API_URL_MEDIA_PLAY,
		messages: {
			success: "Video successfully played",
			error: "Video play failed",
		},
	});
};

/**
 * GET /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-mediaschedule
 */
export const getMediaSchedule: ApiCall<void, MediaSchedule> = () => {
	return sendRequest({
		url: API_URL_MEDIA_SCHEDULE,
		messages: {
			success: "Schedule fetched",
			error: "Schedule fetching failed",
		},
	});
};

/**
 * POST /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-mediaschedule
 */
export const postMediaSchedule: ApiCall<NewMediaSchedule, never> = (videoSchedule) => {
	const data = {
		schedule: videoSchedule,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_MEDIA_SCHEDULE,
		data,
		messages: {
			success: "Media schedule set",
			error: "Media schedule setting failed",
		},
	});
};

/**
 * PUT /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#put-mediaschedule
 */
export const putMediaSchedule: ApiCall<UpdatedMediaScheduleItem> = (data) => {
	return sendRequest({
		method: "PUT",
		url: API_URL_MEDIA_SCHEDULE,
		data,
		messages: {
			success: "Media updated",
			error: "Media updating failed",
		},
	});
};

/**
 * DELETE /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#delete-mediaschedule
 */
export const deleteMediaSchedule: ApiCall<void, never> = () => {
	return sendRequest({
		method: "DELETE",
		url: API_URL_MEDIA_SCHEDULE,
		messages: {
			success: "Media schedule deleted",
			error: "Media schedule deleting failed",
		},
	});
};

/**
 * POST /media/schedule/setup
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-mediaschedulesetup
 */
export const postMediaScheduleSetup: ApiCall<SheetInitialSettings, never> = ({ sheetUrl, worksheetName }) => {
	const data = {
		sheet_url: sheetUrl,
		sheet_name: worksheetName,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_MEDIA_SCHEDULE_SETUP,
		data,
		messages: {
			success: "Setup done",
			error: "Setup error",
		},
	});
};

/**
 * POST /media/schedule/pull
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-mediaschedulepull
 */
export const postMediaSchedulePull: ApiCall<void, never> = () => {
	return sendRequest({
		method: "POST",
		url: API_URL_MEDIA_SCHEDULE_PULL,
		messages: {
			success: "Pull done",
			error: "Pull error",
		},
	});
};

/**
 * GET /media/schedule/status
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-mediaschedulestatus
 */
export const getMediaScheduleStatus: ApiCall<void, MediaScheduleStatus> = () => {
	return sendRequest({
		url: API_URL_MEDIA_SCHEDULE_STATUS,
		messages: {
			success: "Schedule status fetched",
			error: "Schedule status fetching failed",
		},
	});
};
