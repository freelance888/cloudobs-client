import { All, MediaPlaySettings, MediaSchedule, NewMediaSchedule, UpdatedMediaScheduleItem } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_MEDIA_PLAY = "/media/play";
const API_URL_MEDIA_SCHEDULE = "/media/schedule";

/**
 * POST /media/play
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-mediaplay
 */
export const postMediaPlay: ApiCall<All<MediaPlaySettings>, never> = (mediaPlaySettings) => {
	const data = {
		params: mediaPlaySettings,
	};

	return processResponse(sendRequest("POST", API_URL_MEDIA_PLAY, data), {
		success: "Video successfully played",
		error: "Video play failed",
	});
};

/**
 * DELETE /media/play
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#delete-mediaplay
 */
export const deleteMediaPlay: ApiCall<void, never> = () => {
	return processResponse(sendRequest("DELETE", API_URL_MEDIA_PLAY), {
		success: "Video successfully played",
		error: "Video play failed",
	});
};

/**
 * GET /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#get-mediaschedule
 */
export const getMediaSchedule: ApiCall<void, MediaSchedule> = () => {
	return processResponse(sendRequest("GET", API_URL_MEDIA_SCHEDULE), {
		success: "Schedule fetched",
		error: "Schedule fetching failed",
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

	return processResponse(sendRequest("POST", API_URL_MEDIA_SCHEDULE, data), {
		success: "Media schedule set",
		error: "Media schedule setting failed",
	});
};

/**
 * PUT /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#put-mediaschedule
 */
export const putMediaSchedule: ApiCall<UpdatedMediaScheduleItem> = (data) => {
	return processResponse(sendRequest("PUT", API_URL_MEDIA_SCHEDULE, data), {
		success: "Media updated",
		error: "Media updating failed",
	});
};

/**
 * DELETE /media/schedule
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#delete-mediaschedule
 */
export const deleteMediaSchedule: ApiCall<void, never> = () => {
	return processResponse(sendRequest("DELETE", API_URL_MEDIA_SCHEDULE), {
		success: "Media schedule deleted",
		error: "Media schedule deleting failed",
	});
};
