import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GDriveFile, LangMap, SyncableSettingsFlags } from "../../services/types";
import { RootSelector } from "../store";

export enum SocketConnectionStatus {
	CONNECTING = "CONNECTING",
	FAILED = "FAILED",
	UNAUTHORIZED = "UNAUTHORIZED",
}

type AppState = {
	socketConnectionStatus: SocketConnectionStatus;
	syncedParameters: SyncableSettingsFlags;
	videoData: LangMap<GDriveFile[]>;
	serverDateTime: string;
};

const initialState: AppState = {
	socketConnectionStatus: SocketConnectionStatus.CONNECTING,
	syncedParameters: {
		sourceVolume: false,
		translationVolume: false,
		translationOffset: false,
		ratio: false,
		release_time: false,
		threshold: false,
		output_gain: false,
		transition_point: false,
		vmixSpeakerBackgroundVolume: false,
		enabled: false,
		tsGainEnabled: false,
		tsLimiterEnabled: false,
		tsGain: false,
		tsThreshold: false,
		tsReleaseTime: false,
	},
	videoData: {},
	serverDateTime: "",
};

// const processSynchronization = <T extends LangMap<number>>(
// 	settings: T,
// 	syncAllLanguages: boolean,
// 	languagesSettings: LangMap<MinionConfig>
// ) => {
// 	const value = Object.values(settings)?.[0];
// 	let specifiedSettings: LangMap<typeof value> = {};

// 	if (syncAllLanguages) {
// 		for (const language in languagesSettings) {
// 			specifiedSettings[language] = value;
// 		}
// 	} else {
// 		specifiedSettings = settings;
// 	}

// 	return specifiedSettings;
// };

const { actions, reducer } = createSlice({
	name: "app",
	initialState,
	reducers: {
		connectionInitiated(state) {
			state.socketConnectionStatus = SocketConnectionStatus.CONNECTING;
		},
		connectionFailed(state) {
			state.socketConnectionStatus = SocketConnectionStatus.FAILED;
		},
		unauthorized(state) {
			state.socketConnectionStatus = SocketConnectionStatus.UNAUTHORIZED;
		},
		updateSyncedParameters(state, { payload }: PayloadAction<Partial<SyncableSettingsFlags>>) {
			state.syncedParameters = {
				...state.syncedParameters,
				...payload,
			};
		},
		setServerDateTime(state, { payload }: PayloadAction<string>) {
			state.serverDateTime = payload;
		},
	},
});

export const { connectionInitiated, connectionFailed, unauthorized, updateSyncedParameters, setServerDateTime } =
	actions;

export const selectSocketConnectionStatus: RootSelector<SocketConnectionStatus> = ({ app }) =>
	app.socketConnectionStatus;
export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectCurrentServerDateTime: RootSelector<string> = ({ app }) => app.serverDateTime;

export default reducer;
