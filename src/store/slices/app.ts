import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LangMap, GDriveFile, Registry, SyncableSettingsFlags, ServerStatus } from "../../services/types";
import { RootSelector } from "../store";

type AppState = {
	syncedParameters: SyncableSettingsFlags;
	videoData: LangMap<GDriveFile[]>;
	// TODO extract registry to a separate slice
	registry: Registry | null;
};

const initialState: AppState = {
	syncedParameters: {
		sourceVolume: false,
		translationVolume: false,
		translationOffset: false,
		ratio: false,
		release_time: false,
		threshold: false,
		output_gain: false,
		transition_point: false,
	},
	videoData: {},
	registry: null,
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
		updateSyncedParameters(state, { payload }: PayloadAction<Partial<SyncableSettingsFlags>>) {
			state.syncedParameters = {
				...state.syncedParameters,
				...payload,
			};
		},
		updateRegistry(state, { payload }: PayloadAction<any | null>) {
			state.registry = payload;

			state.registry = {
				obs_sheet_url:
					"https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME/edit#gid=2006470615",
				obs_sheet_name: "table_4",
				minion_configs: {
					Bel: {
						addr_config: {
							obs_host: "localhost",
							minion_server_addr: "localhost",
							websocket_port: 4439,
							password: "",
							original_media_url: "srt://5.78.86.60:9005",
						},
						stream_settings: {
							server: "rtmp://5.75.155.174/fdgdsfg/",
							key: "origin2",
						},
						stream_on: {
							value: false,
						},
						ts_offset: {
							value: 9000,
						},
						ts_volume: {
							value: 0,
						},
						source_volume: {
							value: 0,
						},
						sidechain_settings: {
							ratio: 32,
							release_time: 1000,
							threshold: -30,
							output_gain: -10,
						},
						transition_settings: {
							transition_point: 7500,
						},
						gdrive_settings: {
							folder_id: "1XkYnJ49Wb6PUJvldhKMD5mGGgXIYF-BB",
							media_dir: "./content",
							api_key: "AIzaSyBPBOsIj-uutI_9FVfrh5XZF9KiArZ8J2E",
							sync_seconds: 60,
							gdrive_sync_addr: "http://localhost:7000",
						},
					},
					Ces: {
						addr_config: {
							obs_host: "localhost",
							minion_server_addr: "localhost",
							websocket_port: 4439,
							password: "",
							original_media_url: "srt://5.78.86.60:9005",
						},
						stream_settings: {
							server: "rtmp://5.75.155.174/fdgdsf2g/",
							key: "origin2",
						},
						stream_on: {
							value: true,
						},
						ts_offset: {
							value: 9000,
						},
						ts_volume: {
							value: 0,
						},
						source_volume: {
							value: 0,
						},
						sidechain_settings: {
							ratio: 32,
							release_time: 1000,
							threshold: -30,
							output_gain: -10,
						},
						transition_settings: {
							transition_point: 7500,
						},
						gdrive_settings: {
							folder_id: "1XkYnJ49Wb6PUJvldhKMD5mGGgXIYF-BB",
							media_dir: "./content",
							api_key: "AIzaSyBPBOsIj-uutI_9FVfrh5XZF9KiArZ8J2E",
							sync_seconds: 60,
							gdrive_sync_addr: "http://localhost:7000",
						},
					},
				},
				infrastructure_lock: true,
				server_status: ServerStatus.RUNNING,
				timing_sheet_url:
					"https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME/edit#gid=2006470615",
				timing_sheet_name: "demo_timing",
				timing_list: [
					{
						name: "01_BEL_video",
						timestamp: "10",
						is_enabled: true,
						is_played: false,
					},
					{
						name: "02_BEL_video",
						timestamp: "15",
						is_enabled: true,
						is_played: false,
					},
					{
						name: "03_BEL_video",
						timestamp: "30",
						is_enabled: true,
						is_played: false,
					},
				],
				timing_start_time: null,
				// timing_start_time: "2023-02-21T00:00:00",
				vmix_players: {
					"*": {
						name: "All",
						active: true,
					},
				},
				active_vmix_player: "*",
				gdrive_files: {
					Bel: {
						"01_BEL_video.mp4": true,
						"02_BEL_video.mp4": true,
						"03_BEL_video.mp4": true,
					},
					Ces: {
						"01_CES_video.mp4": true,
						"02_CES_video.mp4": true,
						"03_CES_video.mp4": true,
					},
				},
			};
		},
	},
});

export const { updateSyncedParameters, updateRegistry } = actions;

export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectRegistry: RootSelector<Registry> = ({ app }) => app.registry as Registry;

export default reducer;
