import { MediaSchedule, MediaScheduleItem } from "../services/types";

export const convertTimeStampToTime = (timestamp: number): string => {
	const date = new Date(0);
	date.setSeconds(timestamp);
	const time = date.toISOString().substring(11, 19);
	return time;
};

export const parseTimestamps = (mediaSchedule: MediaSchedule): MediaSchedule => {
	return Object.keys(mediaSchedule).reduce<Record<string, MediaScheduleItem>>((updatedMediaSchedule, mediaId) => {
		const item = mediaSchedule[mediaId];

		updatedMediaSchedule[mediaId] = {
			...item,
			timestamp: convertTimeStampToTime(Number(item.timestamp)),
		};

		return updatedMediaSchedule;
	}, {});
};
