import { MediaSchedule, MediaScheduleItem } from "../services/types";

export const convertTimeStampToTime = (timestamp: number, millis?: boolean): string => {
	const date = new Date(0);
	millis ? date.setMilliseconds(timestamp) : date.setSeconds(timestamp);
	const time = date.toISOString().substring(11, 19);
	return time;
};

export function formatTimestamp(timestamp: string | number): string {
	const totalSeconds = Math.floor(parseFloat(timestamp as string));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const milliseconds = Math.floor((parseFloat(timestamp as string) - totalSeconds) * 1000);

	const formattedHours = hours.toString().padStart(2, "0");
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = seconds.toString().padStart(2, "0");
	const formattedMilliseconds = milliseconds.toString().padStart(3, "0");

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

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
