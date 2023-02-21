import { default as io } from "socket.io-client";

import { AppDispatch } from "../store/store";
import { updateRegistry } from "../store/slices/registry";
import { Registry } from "./types";

const socket = io("http://localhost:5010/");

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

type ServerResponse<T> = {
	result: boolean;
	details: string;
	serializable_object: T | null;
};

let appDispatch: AppDispatch;

export const subscribe = (dispatch: AppDispatch) => {
	appDispatch = dispatch;

	socket.on("connect", () => {
		getInfo();
	});

	socket.on("on_registry_change", (data: string) => {
		if (data) {
			appDispatch(updateRegistry(JSON.parse(data)));
		}
	});
	return () => {
		socket.disconnect();
	};
};

export const getInfo = () => {
	sendCommand(Command.GetInfo, {}, (response: ServerResponse<{ registry: Registry }>) => {
		if (response.result && response.serializable_object) {
			appDispatch(updateRegistry(response.serializable_object.registry));
		}
	});
};

type PullConfigPayload = {
	sheet_url?: string;
	sheet_name?: string;
	langs?: string[];
	ip_langs?: Record<string, string>;
};

export const pullConfig = (payload?: PullConfigPayload) => {
	sendCommand(Command.PullConfig, {
		details: { ...payload },
	});
};

export const dispose = () => {
	sendCommand(Command.Dispose);
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
		details: { value },
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
		details: { ...settings },
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

export const pullTiming = (sheet_url?: string, sheet_name?: string) => {
	sendCommand(Command.PullTiming, {
		details: { sheet_url, sheet_name },
	});
};

export const runTiming = (countdown?: string, daytime?: string) => {
	sendCommand(Command.RunTiming, {
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
	sendCommand(Command.StopMedia, { lang });
};

export const refreshSource = (lang?: string) => {
	sendCommand(Command.RefreshSource, { lang });
};

export const listGdriveFiles = (lang?: string) => {
	sendCommand(Command.ListGdriveFiles, { lang });
};

const sendCommand = <T>(
	command: Command,
	data: Record<string, unknown> = {},
	callback?: (response: ServerResponse<T>) => void
) => {
	socket.emit(
		"command",
		JSON.stringify({
			command,
			...data,
		}),
		(response: string) => {
			console.log(`--> '${command}' request`, JSON.stringify(data));
			console.log(`--> '${command}' response`, JSON.parse(response));
			callback?.(JSON.parse(response));
		}
	);
};
