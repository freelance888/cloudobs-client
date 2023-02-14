import io from "socket.io-client";

import { updateRegistry } from "../store/slices/app";

import { InfoResponse } from "./types";

export const socket = io("http://192.168.31.146:5010/");

enum Command {
	PullConfig = "pull config",
	Dispose = "dispose",
	GetInfo = "get info",
	SetStreamSettings = "set stream settings",
	SetTeamspeakOffset = "set teamspeak offset",
	SetTeamspeakVolume = "set teamspeak volume",
	SetSourceVolume = "set source volume",
	SetSidechainSettings = "set sidechain settings",
	SetTransitionSettings = "set transition settings",
	InfrastructureLock = "infrastructure lock",
	InfrastructureUnlock = "infrastructure unlock",
	VmixPlayerAdd = "vmix players add",
	VmixPlayerRemove = "vmix players remove",
	VmixPlayersSetActive = "vmix players set active",
	StartStreaming = "start streaming",
	StopStreaming = "stop streaming",
	PullTiming = "pull timing",
	RunTiming = "run timing",
	StopTiming = "stop timing",
	RemoveTiming = "remove timing",
	PlayMedia = "play media",
	StopMedia = "stop media",
	RefreshSource = "refresh source",
	ListGdriveFiles = "list gdrive files",
}

const sendCommand = (command: Command, data: Record<string, unknown> = {}, callback?: (data: string) => void) => {
	socket.emit(
		"command",
		{
			command,
			...data,
		},
		(response: string) => {
			console.log(`--> ${command} response`, JSON.parse(response));
			callback?.(JSON.stringify(data));
		}
	);
};

export const getInfo = (dispatch) => {
	sendCommand(Command.GetInfo, {}, (data: string) => {
		const parsedData: InfoResponse = JSON.parse(data);
		if (parsedData?.result && parsedData?.serializable_object) {
			dispatch(updateRegistry(parsedData?.serializable_object?.registry));
		}
	});
};

export const pullConfig = (
	sheet_url = "https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME",
	sheet_name = "table_4"
) => {
	sendCommand(Command.PullConfig, {
		details: { sheet_url, sheet_name },
	});
};

export const dispose = (
	sheet_url = "https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME",
	sheet_name = "table_4"
) => {
	sendCommand(Command.Dispose, {
		details: { sheet_url, sheet_name },
	});
};

export const setStreamSettings = (server: string, key: string, lang?: string) => {
	sendCommand(Command.SetStreamSettings, {
		details: { server, key },
		lang,
	});
};

export const setTeamspeakOffset = (value: number, lang?: string) => {
	sendCommand(Command.SetTeamspeakOffset, {
		details: { value },
		lang,
	});
};

export const setTeamspeakVolume = (value: number, lang?: string) => {
	sendCommand(Command.SetTeamspeakVolume, {
		details: { value },
		lang,
	});
};

export const setSourceVolume = (value: number, lang?: string) => {
	sendCommand(Command.SetSourceVolume, {
		details: {
			value,
		},
		lang,
	});
};

type SidechainSettings = {
	ratio?: number;
	release_time?: number;
	threshold?: number;
	output_gain?: number;
};

export const setSidechainSettings = (settings: SidechainSettings, lang?: string) => {
	sendCommand(Command.SetSidechainSettings, {
		details: {
			...settings,
		},
		lang,
	});
};

export const setTransitionSettings = (transition_point?: number, lang?: string) => {
	sendCommand(Command.SetTransitionSettings, {
		details: {
			transition_point,
		},
		lang,
	});
};

export const setInfrastructureLock = () => {
	sendCommand(Command.InfrastructureLock);
};

export const setInfrastructureUnlock = () => {
	sendCommand(Command.InfrastructureUnlock);
};

export const vmixPlayersAdd = (ip: string, name: string) => {
	sendCommand(Command.VmixPlayerAdd, {
		details: { ip, name },
	});
};

export const vmixPlayersRemove = (ip: string) => {
	if (ip === "*") {
		throw new Error("You cannot delete vMix player with ip '*'");
	}

	sendCommand(Command.VmixPlayerRemove, {
		details: { ip },
	});
};

export const vmixPlayersSetActive = (ip: string) => {
	sendCommand(Command.VmixPlayersSetActive, {
		details: { ip },
	});
};

export const startStreaming = (lang?: string) => {
	sendCommand(Command.StartStreaming, { lang });
};

export const stopStreaming = (lang?: string) => {
	sendCommand(Command.StopStreaming, { lang });
};

export const pullTiming = (sheet_url: string, sheet_name: string) => {
	sendCommand(Command.StartStreaming, {
		details: { sheet_url, sheet_name },
	});
};

export const runTiming = (countdown?: string, daytime?: string) => {
	sendCommand(Command.StartStreaming, {
		details: { countdown, daytime },
	});
};

export const stopTiming = () => {
	sendCommand(Command.StopTiming);
};

export const removeTiming = () => {
	sendCommand(Command.RemoveTiming);
};

//- `force` - stops any playing media and plays the specified one (default).
//- `check_any` - plays specified media only if no media is being played.
//- `check_same` - plays specified media only if it is not being played.
type PlayMediaMode = "force" | "check_any" | "check_same";

export const playMedia = (name: string, search_by_num: boolean, mode: PlayMediaMode = "force", lang?: string) => {
	sendCommand(Command.PlayMedia, {
		details: {
			name,
			search_by_num,
			mode,
		},
		lang,
	});
};

export const stopMedia = (lang?: string) => {
	sendCommand(Command.RemoveTiming, { lang });
};

export const refreshSource = (lang?: string) => {
	sendCommand(Command.RefreshSource, { lang });
};

export const listGdriveFiles = (lang?: string) => {
	sendCommand(Command.ListGdriveFiles, { lang });
};
