import { MediaSchedule } from "../services/types";
import { convertTimeStampToTime, parseTimestamps } from "./timestamp";

it("convertTimeStampToTime", () => {
	expect(convertTimeStampToTime(0)).toBe("00:00:00");
	expect(convertTimeStampToTime(1)).toBe("00:00:01");
	expect(convertTimeStampToTime(100)).toBe("00:01:40");
	expect(convertTimeStampToTime(1000)).toBe("00:16:40");
	expect(convertTimeStampToTime(3600)).toBe("01:00:00");
	expect(convertTimeStampToTime(10000)).toBe("02:46:40");
});

describe("parseTimestamps", () => {
	it('timestamp: "10"', () => {
		const mediaSchedule: MediaSchedule = {
			id1: {
				name: "video_1",
				timestamp: "10",
				is_enabled: true,
				is_played: false,
			},
		};

		expect(parseTimestamps(mediaSchedule)).toEqual({
			id1: {
				name: "video_1",
				timestamp: "00:00:10",
				is_enabled: true,
				is_played: false,
			},
		});
	});

	it('timestamp: "4444"', () => {
		const mediaSchedule: MediaSchedule = {
			id1: {
				name: "video_1",
				timestamp: "4444",
				is_enabled: true,
				is_played: false,
			},
		};

		expect(parseTimestamps(mediaSchedule)).toEqual({
			id1: {
				name: "video_1",
				timestamp: "01:14:04",
				is_enabled: true,
				is_played: false,
			},
		});
	});
});
