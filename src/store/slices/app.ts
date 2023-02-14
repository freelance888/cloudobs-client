import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as ApiService from "../../services/api/index";
import {
	All,
	GDriveFile,
	LanguagesSettings,
	MinionConfig,
	Registry,
	SidechainSettings,
	SourceVolumeSettings,
	StreamDestinationSettings,
	SyncableSettingsFlags,
	TransitionSettings,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
} from "../../services/types";
import { RootSelector, RootState } from "../store";
import {
	dispose,
	getInfo,
	refreshSource as refreshSourceSocket,
	setSidechainSettings,
	setSourceVolume as setSourceVolumeSocket,
	setStreamSettings as setStreamSettingsSocket,
	setTeamspeakOffset,
	setTeamspeakVolume,
	setTransitionSettings,
	startStreaming as startStreamingSocket,
	stopStreaming as stopStreamingSocket,
} from "../../services/soketApi";

type ActiveRequest = keyof typeof ApiService;

type AppState = {
	initialized: boolean;
	initialLanguageSettingsLoaded: boolean;
	streamParametersLoaded: boolean;
	activeRequest: ActiveRequest | null;
	syncedParameters: SyncableSettingsFlags;
	languagesSettings: LanguagesSettings;
	videoData: All<GDriveFile[]>;
	registry: Registry | null;
};

const initialState: AppState = {
	initialized: true,
	initialLanguageSettingsLoaded: false,
	streamParametersLoaded: false,
	activeRequest: null,
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
	languagesSettings: {},
	videoData: {},
	registry: null,
};

const getAllLanguages: (state: RootState) => string[] = (state) => {
	return Object.keys(state.app.registry?.minion_configs || {});
};

export const cleanup: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<void, void, { state: RootState }>(
	"app/cleanup",
	async (_, { dispatch }) => {
		dispose(); // also makes DELETE /minions/delete_vms
		getInfo(dispatch);
	}
);
//todo clarify emit
export const refreshServers: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/refreshServers", async (_, { rejectWithValue }) => {
	const result = await ApiService.postSheetsPull();
	// pull config emit
	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	//dispatch(fetchLanguagesSettings());
});

export const setStreamSettings: AsyncThunk<
	void,
	All<StreamDestinationSettings>,
	{ state: RootState }
> = createAsyncThunk<void, All<StreamDestinationSettings>, { state: RootState }>(
	"app/setStreamSettings",
	async (streamSettings) => {
		Object.entries(streamSettings).forEach(([language, settings]) => {
			setStreamSettingsSocket(settings.server, settings.key, language);
		});
	}
);

export const startStreaming: AsyncThunk<void, string[] | undefined, { state: RootState }> = createAsyncThunk<
	void,
	string[] | undefined,
	{ state: RootState }
>("app/startStreaming", async (languages, { getState }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());
	affectedLanguages.length > 0
		? affectedLanguages.forEach((language) => startStreamingSocket(language))
		: startStreamingSocket();
});

export const stopStreaming: AsyncThunk<void, string[] | undefined, { state: RootState }> = createAsyncThunk<
	void,
	string[] | undefined,
	{ state: RootState }
>("app/stopStreaming", async (languages, { getState }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

	affectedLanguages.length > 0
		? affectedLanguages.forEach((language) => stopStreamingSocket(language))
		: stopStreamingSocket();
});

const processSynchronization = <T extends All<number>>(
	settings: T,
	syncAllLanguages: boolean,
	languagesSettings: All<MinionConfig>
) => {
	const value = Object.values(settings)?.[0];
	let specifiedSettings: All<typeof value> = {};

	if (syncAllLanguages) {
		for (const language in languagesSettings) {
			specifiedSettings[language] = value;
		}
	} else {
		specifiedSettings = settings;
	}

	return specifiedSettings;
};

export const setSourceVolume: AsyncThunk<void, All<SourceVolumeSettings>, { state: RootState }> = createAsyncThunk<
	void,
	All<SourceVolumeSettings>,
	{ state: RootState }
>("app/setSourceVolume", async (volumeSettings, { getState }) => {
	const { app } = getState();

	const specifiedVolumeSettings = processSynchronization(
		volumeSettings,
		app.syncedParameters.sourceVolume,
		app.registry?.minion_configs || {}
	);

	Object.entries(specifiedVolumeSettings).forEach(([language, settings]) => {
		setSourceVolumeSocket(settings, language);
	});
});

export const setTranslationVolume: AsyncThunk<
	void,
	All<TranslationVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<void, All<TranslationVolumeSettings>, { state: RootState }>(
	"app/setTranslationVolume",
	async (volumeSettings, { getState }) => {
		const { app } = getState();

		const specifiedVolumeSettings = processSynchronization(
			volumeSettings,
			app.syncedParameters.translationVolume,
			app.registry?.minion_configs || {}
		);

		Object.entries(specifiedVolumeSettings).forEach(([language, settings]) => {
			setTeamspeakVolume(settings, language);
		});
	}
);

export const setTranslationOffset: AsyncThunk<
	void,
	All<TranslationOffsetSettings>,
	{ state: RootState }
> = createAsyncThunk<void, All<TranslationOffsetSettings>, { state: RootState }>(
	"app/setTranslationOffset",
	async (offsetSettings, { getState }) => {
		const { app } = getState();

		const specifiedOffsetSettings = processSynchronization(
			offsetSettings,
			app.syncedParameters.translationOffset,
			app.registry?.minion_configs || {}
		);

		Object.entries(specifiedOffsetSettings).forEach(([language, settings]) => {
			setTeamspeakOffset(settings, language);
		});
	}
);

export const setSidechain: AsyncThunk<void, All<Partial<SidechainSettings>>, { state: RootState }> = createAsyncThunk<
	void,
	All<Partial<SidechainSettings>>,
	{ state: RootState }
>("app/setSidechain", async (sidechainSettings) => {
	Object.entries(sidechainSettings).forEach(([language, settings]) => {
		setSidechainSettings(settings.ratio, settings.release_time, settings.threshold, settings.output_gain, language);
	});
});

export const setTransition: AsyncThunk<void, All<Partial<TransitionSettings>>, { state: RootState }> = createAsyncThunk<
	void,
	All<Partial<TransitionSettings>>,
	{ state: RootState }
>("app/setTransition", async (transitionSettings) => {
	Object.entries(transitionSettings).forEach(([language, settings]) => {
		setTransitionSettings(settings?.transition_point, language);
	});
});

export const refreshSource: AsyncThunk<void, string[] | undefined, { state: RootState }> = createAsyncThunk<
	void,
	string[] | undefined,
	{ state: RootState }
>("app/refreshSource", async (languages, { getState }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

	affectedLanguages.length > 0
		? affectedLanguages.forEach((language) => refreshSourceSocket(language))
		: refreshSourceSocket();
});

const { actions, reducer } = createSlice({
	name: "app",
	initialState,
	reducers: {
		updateActiveRequest(state, { payload }: PayloadAction<ActiveRequest | null>) {
			state.activeRequest = payload;
		},
		updateSyncedParameters(state, { payload }: PayloadAction<Partial<SyncableSettingsFlags>>) {
			state.syncedParameters = {
				...state.syncedParameters,
				...payload,
			};
		},
		updateRegistry(state, { payload }: PayloadAction<any | null>) {
			state.registry = payload;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(cleanup.pending, (state) => {
				state.activeRequest = "postCleanup";
			})
			.addCase(cleanup.fulfilled, (state) => {
				state.activeRequest = null;
			}),
	//Remove?
	// .addCase(setStreamSettings.fulfilled, (state, { payload }) => {
	// 	const streamSettings = payload.data;
	// 	if (streamSettings) {
	// 		Object.keys(streamSettings).forEach((language) => {
	// 			const destination = streamSettings[language];
	// 			state.languagesSettings[language].streamDestination = destination;
	// 		});
	// 	}
	// })
	// .addCase(startStreaming.fulfilled, (state, { payload }) => {
	// 	const languages = payload.data;
	// 	if (languages) {
	// 		languages.forEach((language) => {
	// 			state.languagesSettings[language].streamParameters.streamActive = true;
	// 		});
	// 	}
	// })
	// .addCase(stopStreaming.fulfilled, (state, { payload: languages }) => {
	// 	languages.forEach((language) => {
	// 		state.languagesSettings[language].streamParameters.streamActive = false;
	// 	});
	// })
	// .addCase(setSourceVolume.fulfilled, (state, { payload: volumeSettings }) => {
	// 	for (const language in volumeSettings.data) {
	// 		const sourceVolume = volumeSettings.data[language];
	// 		state.languagesSettings[language].streamParameters.sourceVolume = sourceVolume;
	// 	}
	// })
	// .addCase(setTranslationVolume.fulfilled, (state, { payload: volumeSettings }) => {
	// 	for (const language in volumeSettings.data) {
	// 		const translationVolume = volumeSettings.data[language];
	// 		state.languagesSettings[language].streamParameters.translationVolume = translationVolume;
	// 	}
	// })
	// .addCase(setTranslationOffset.fulfilled, (state, { payload: offsetSettings }) => {
	// 	for (const language in offsetSettings.data) {
	// 		const translationOffset = offsetSettings.data[language] as number;
	// 		state.languagesSettings[language].streamParameters.translationOffset = translationOffset;
	// 	}
	// })
	// .addCase(setSidechain.fulfilled, (state, { payload: sidechainSettings }) => {
	// 	for (const language in sidechainSettings.data) {
	// 		const updatedSidechainSettings = sidechainSettings.data[language];
	// 		state.languagesSettings[language].sidechain = {
	// 			...state.languagesSettings[language].sidechain,
	// 			...updatedSidechainSettings,
	// 		};
	// 	}
	// })
	// .addCase(setTransition.fulfilled, (state, { payload: transitionSettings }) => {
	// 	for (const language in transitionSettings.data) {
	// 		if (language === "__all__") {
	// 			const languages = Object.keys(state.languagesSettings);
	// 			languages.forEach((language) => {
	// 				state.languagesSettings[language].transition = {
	// 					...state.languagesSettings[language].transition,
	// 					...transitionSettings?.data?.["__all__"],
	// 				};
	// 			});
	// 		} else {
	// 			const updatedTransitionSettings = transitionSettings.data[language];
	// 			state.languagesSettings[language].transition = {
	// 				...state.languagesSettings[language].transition,
	// 				...updatedTransitionSettings,
	// 			};
	// 		}
	// 	}
	// }),
});

export const { updateSyncedParameters, updateRegistry } = actions;

export const selectActiveRequest: RootSelector<ActiveRequest | null> = ({ app }) => app.activeRequest;

export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectLanguagesSettings: RootSelector<LanguagesSettings> = ({ app }) => app.languagesSettings;

export const selectVideosData: RootSelector<All<GDriveFile[]>> = ({ app }) => app.videoData;

export const selectRegistry: RootSelector<any> = ({ app }) => app.registry;

export default reducer;
