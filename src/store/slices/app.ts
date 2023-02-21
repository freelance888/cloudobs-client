import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LangMap, GDriveFile, SyncableSettingsFlags } from "../../services/types";
import { RootSelector } from "../store";

type AppState = {
	syncedParameters: SyncableSettingsFlags;
	videoData: LangMap<GDriveFile[]>;
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
	},
});

export const { updateSyncedParameters } = actions;

export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export default reducer;
