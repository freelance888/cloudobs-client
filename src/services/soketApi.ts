import io from "socket.io-client";

import { updateRegistry } from "../store/slices/app";

import { InfoResponse } from "./types";

export const socket = io("http://192.168.31.146:5010/");

export const getInfo = (dispatch) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "get info",
		}),
		(data: string) => {
			const parsedData: InfoResponse = JSON.parse(data);
			if (parsedData?.result && parsedData?.serializable_object) {
				dispatch(updateRegistry(parsedData?.serializable_object?.registry));
			}
		}
	);
};

export const pullConfig = (
	sheetUrl = "https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME",
	sheetName = "table_4"
) => {
	console.log("pull config", socket);
	socket.emit(
		"command",
		JSON.stringify({
			command: "pull config",
			details: {
				sheet_url: sheetUrl,
				sheet_name: sheetName,
			},
		}),
		(response) => {
			console.log("pull config response", JSON.parse(response));
		}
	);
};

export const dispose = (
	sheetUrl = "https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME",
	sheetName = "table_4"
) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "dispose",
			details: {
				sheet_url: sheetUrl,
				sheet_name: sheetName,
			},
		}),
		(response) => {
			console.log("dispose config response", JSON.parse(response));
		}
	);
};

export const setStreamSettings = (server: string, key: string, lang: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "dispose",
			details: {
				server,
				key,
			},
			lang,
		}),
		(response) => {
			console.log("setStreamSettings response", JSON.parse(response));
		}
	);
};

export const setTeamspeakOffset = (value: number, lang: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "set teamspeak offset",
			details: {
				value,
			},
			lang,
		}),
		(response) => {
			console.log("setTeamspeakOffset response", JSON.parse(response));
		}
	);
};

export const setTeamspeakVolume = (value: number, lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "set teamspeak volume",
			details: {
				value,
			},
			lang,
		}),
		(response) => {
			console.log("setTeamspeakOffset response", JSON.parse(response));
		}
	);
};

export const setSourceVolume = (value: number, lang: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "set source volume",
			details: {
				value,
			},
			lang,
		}),
		(response) => {
			console.log("setSourceVolume response", JSON.parse(response));
		}
	);
};

export const setSidechainSettings = (
	ratio?: number,
	release_time?: number,
	threshold?: number,
	output_gain?: number,
	lang?: string
) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "set sidechain settings",
			details: {
				ratio,
				release_time,
				threshold,
				output_gain,
			},
			lang,
		}),
		(response) => {
			console.log("setSidechainSettings response", JSON.parse(response));
		}
	);
};

export const setTransitionSettings = (transition_point?: number, lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "set transition settings",
			details: {
				transition_point,
			},
			lang,
		}),
		(response) => {
			console.log("setSidechainSettings response", JSON.parse(response));
		}
	);
};

export const setInfrastructureLock = () => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "infrastructure lock",
		}),
		(response) => {
			console.log("setInfrastructureLock response", JSON.parse(response));
		}
	);
};

export const setInfrastructureUnlock = () => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "infrastructure unlock",
		}),
		(response) => {
			console.log("setInfrastructureUnlock response", JSON.parse(response));
		}
	);
};

export const vmixPlayersAdd = (ip: string, name: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "vmix players add",
			details: {
				ip,
				name,
			},
		}),
		(response) => {
			console.log("vmixPlayersAdd response", JSON.parse(response));
		}
	);
};

export const vmixPlayersRemove = (ip: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "vmix players remove",
			details: {
				ip,
			},
		}),
		(response) => {
			console.log("vmixPlayersRemove response", JSON.parse(response));
		}
	);
};

export const vmixSetActive = (ip: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "vmix players set active",
			details: {
				ip,
			},
		}),
		(response) => {
			console.log("vmixSetActive response", JSON.parse(response));
		}
	);
};

export const startStreaming = (lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "start streaming",
			lang,
		}),
		(response) => {
			console.log("startStreaming response", JSON.parse(response));
		}
	);
};

export const stopStreaming = (lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "stop streaming",
			lang,
		}),
		(response) => {
			console.log("stopStreaming response", JSON.parse(response));
		}
	);
};

export const pullTiming = (sheet_url: string, sheet_name: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "pull timing",
			details: {
				sheet_url,
				sheet_name,
			},
		}),
		(response) => {
			console.log("pullTiming response", JSON.parse(response));
		}
	);
};

export const runTiming = (countdown?: string, daytime?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "run timing",
			details: {
				countdown,
				daytime,
			},
		}),
		(response) => {
			console.log("runTiming response", JSON.parse(response));
		}
	);
};

export const stopTiming = () => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "stop timing",
		}),
		(response) => {
			console.log("stopTiming response", JSON.parse(response));
		}
	);
};

export const removeTiming = () => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "remove timing",
		}),
		(response) => {
			console.log("removeTiming response", JSON.parse(response));
		}
	);
};

//- `force` - stops any playing media and plays the specified one (default).
//- `check_any` - plays specified media only if no media is being played.
//- `check_same` - plays specified media only if it is not being played.
export const playMedia = (
	name: string,
	search_by_num: boolean,
	mode: "force" | "check_any" | "check_same",
	lang?: string
) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "play media",
			details: {
				name,
				search_by_num,
				mode,
			},
			lang,
		}),
		(response) => {
			console.log("playMedia response", JSON.parse(response));
		}
	);
};

export const stopMedia = (lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "stop media",
			lang,
		}),
		(response) => {
			console.log("stopMedia response", JSON.parse(response));
		}
	);
};

export const refreshSource = (lang?: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "refresh source",
			lang,
		}),
		(response) => {
			console.log("refreshSource response", JSON.parse(response));
		}
	);
};

export const listGdriveFiles = (lang: string) => {
	socket.emit(
		"command",
		JSON.stringify({
			command: "list gdrive files",
			lang,
		}),
		(response) => {
			console.log("listGdriveFiles response", JSON.parse(response));
			//{
			//   "result": true/false,
			//   "details": "... message ...",
			//   "serializable_object": {
			//     "lang": {
			//       "result": true/false,
			//       "details": "... message ...",
			//       "serializable_object": {
			//         "01_video_rus.mp4": true,  # true - downloaded
			//         "02_audio_eng.mp3": false,  # false - not downloaded yet
			//         ...
			//       }
			//     }
			//   }
			// }
		}
	);
};
