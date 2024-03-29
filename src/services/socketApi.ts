import { default as io, Socket } from "socket.io-client";

import { AppDispatch } from "../store/store";
import { setRegistry, updateRegistry } from "../store/slices/registry";

import { buildUrlFromHostAddress, HostAddress } from "../store/slices/environment";
import { connectionFailed, setServerDateTime, unauthorized } from "../store/slices/app";
import { addNewLog, MAX_MESSAGES, setLogs } from "../store/slices/logs";
import { Registry } from "./types";

enum Command {
	PullConfig = "pull config",
	Dispose = "dispose",
	GetInfo = "get info",
	SetStreamSettings = "set stream settings",
	SetTeamspeakOffset = "set teamspeak offset",
	SetTeamspeakVolume = "set teamspeak volume",
	SetTeamspeakLimiterSettings = "set teamspeak limiter settings",
	SetTeamspeakGainSettings = "set teamspeak gain settings",
	SetSourceVolume = "set source volume",
	SetSidechainSettings = "set sidechain settings",
	SetTransitionSettings = "set transition settings",
	InfrastructureLock = "infrastructure lock",
	InfrastructureUnlock = "infrastructure unlock",
	VmixPlayerAdd = "vmix players add",
	VmixPlayerRemove = "vmix players remove",
	VmixPlayersSetActive = "vmix players set active",
	VmixSpeakerSetBackgroundVolume = "set vmix speaker background volume",
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
	GetLogs = "get logs",
}

enum Event {
	Connect = "connect",
	ReconnectFailed = "reconnect_failed",
	OnRegistryChange = "on_registry_change",
	OnLog = "on_log",
	OnDateTimeUpdate = "on_datetime_update",
	OnAuth = "on_auth",
}

type ServerResponse<T> = {
	result: boolean;
	details: string;
	serializable_object: T | null;
};

type AuthResponse = {
	status: true;
	message: string;
};

let appDispatch: AppDispatch;
let socket: Socket | undefined;

export const initialize = (dispatch: AppDispatch, hostAddress: HostAddress, login, password) => {
	appDispatch = dispatch;

	const url = buildUrlFromHostAddress(hostAddress);

	socket = io(url, {
		reconnectionAttempts: 1,
		timeout: 500,
		auth: {
			HTTP_LOGIN: login,
			HTTP_PASSWORD: password,
		},
	});

	socket.io.on(Event.ReconnectFailed, () => {
		appDispatch(connectionFailed());
	});

	socket.on(Event.OnAuth, (data: string) => {
		const response = JSON.parse(data) as AuthResponse;
		if (!response.status) {
			appDispatch(unauthorized());
			alert(response.message);
		}
	});

	socket.on(Event.Connect, () => {
		getInfo();
		getLogs();
	});

	socket.on(Event.OnRegistryChange, (partialRegistryString: string) => {
		const partialRegistry = JSON.parse(partialRegistryString)?.registry as Partial<Registry>;
		if (partialRegistry && typeof partialRegistry === "object") {
			appDispatch(updateRegistry(partialRegistry));
		} else {
			const error = `[${Event.OnRegistryChange}]: Invalid registry value received: '${partialRegistry}'`;
			console.error(error);
			alert(error);
		}
	});

	socket.on(Event.OnLog, (data: string) => {
		data && appDispatch(addNewLog(JSON.parse(data).log));
	});

	socket.on(Event.OnDateTimeUpdate, (data: string) => {
		data && appDispatch(setServerDateTime(data));
	});

	return () => {
		socket?.disconnect();
		socket = undefined;
	};
};

export const getInfo = () => {
	sendCommand(Command.GetInfo, {}, (response: ServerResponse<string>) => {
		if (response.result && response.serializable_object) {
			const registry = JSON.parse(response.serializable_object)?.registry as Registry | undefined;
			if (registry && typeof registry === "object") {
				appDispatch(setRegistry(registry));
			} else {
				const error = `[${Command.GetInfo}]: Invalid registry value received: '${registry}'`;
				console.error(error);
				alert(error);
			}
		} else {
			appDispatch(unauthorized());
		}
	});
};

export const getLogs = (count = MAX_MESSAGES) => {
	sendCommand(
		Command.GetLogs,
		{
			details: { count },
		},
		(response: ServerResponse<Record<string, any>>) => {
			if (response.result && response.serializable_object) {
				appDispatch(setLogs(response.serializable_object?.logs));
			}
		}
	);
};

type PullConfigPayload = {
	sheet_url?: string;
	sheet_name?: string;
	langs?: string[];
	ip_langs?: Record<string, string>;
	users_sheet_name?: string;
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

type TeamspeakLimiterSettings = {
	enabled?: boolean;
	threshold?: number;
	release_time?: number;
};

export const setTeamspeakLimiterSettings = (settings: TeamspeakLimiterSettings, lang?: string) => {
	sendCommand(Command.SetTeamspeakLimiterSettings, {
		details: { ...settings },
		lang,
	});
};

type TeamspeakGainSettings = {
	enabled?: boolean;
	gain?: number;
};

export const setTeamspeakGainSettings = (settings: TeamspeakGainSettings, lang?: string) => {
	sendCommand(Command.SetTeamspeakGainSettings, {
		details: { ...settings },
		lang,
	});
};

export const setSourceVolume = (value: number, lang?: string) => {
	sendCommand(Command.SetSourceVolume, {
		details: { value },
		lang,
	});
};

export const setVmixSpeakerBackgroundVolume = (value: number, lang?: string) => {
	sendCommand(Command.VmixSpeakerSetBackgroundVolume, {
		details: { value },
		lang,
	});
};

type SidechainSettings = {
	ratio?: number;
	release_time?: number;
	threshold?: number;
	output_gain?: number;
	enabled?: boolean;
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

export const vmixPlayersRemove = (ip: string, name: string) => {
	if (ip === "*") {
		throw new Error("You cannot delete vMix player with ip '*'");
	}

	sendCommand(Command.VmixPlayerRemove, {
		details: { name },
	});
};

export const vmixPlayersSetActive = (name: string) => {
	sendCommand(Command.VmixPlayersSetActive, {
		details: { name },
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
	if (!socket) {
		throw new Error("Socket is not initialized.");
	}

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
