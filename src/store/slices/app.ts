import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as ApiService from "../../services/api/index";
import { ApiResult } from "../../services/api/types";
import { EMPTY_LANGUAGE_SETTINGS } from "../../services/emptyData";
import {
	All,
	getAllGDriveSettings,
	GlobalSettings,
	LanguagesSettings,
	SheetInitialSettings,
	SidechainSettings,
	SourceVolumeSettings,
	StreamDestinationSettings,
	StreamParametersSettings,
	SyncableSettingsFlags,
	TransitionSettings,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
} from "../../services/types";
import { RootSelector, RootState } from "../store";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
};

type ActiveRequest = keyof typeof ApiService;

type AppState = {
	initialized: boolean;
	initialLanguageSettingsLoaded: boolean;
	streamParametersLoaded: boolean;
	activeRequest: ActiveRequest | null;
	syncedParameters: SyncableSettingsFlags;
	languagesSettings: LanguagesSettings;
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
	},
	languagesSettings: {},
};

const getAllLanguages: (state: RootState) => string[] = (state) => {
	return Object.keys(state.app.languagesSettings);
};

export const initialize: AsyncThunk<
	ApiResult<LanguagesSettings>,
	SheetInitialSettings,
	{ state: RootState }
> = createAsyncThunk<ApiResult<LanguagesSettings>, SheetInitialSettings, { state: RootState }>(
	"app/initialize",
	async (data, { rejectWithValue }) => {
		const result = await ApiService.postInit(data);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const fetchLanguagesSettings: AsyncThunk<
	ApiResult<All<GlobalSettings | "#">>,
	void,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<GlobalSettings | "#">>, void, { state: RootState }>(
	"app/fetchLanguagesSettings",
	async (_, { rejectWithValue }) => {
		const result = await ApiService.getInfo();

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const cleanup: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<void, void, { state: RootState }>(
	"app/cleanup",
	async (_, { rejectWithValue }) => {
		const result = await ApiService.postCleanup();

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}
	}
);

export const refreshServers: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/refreshServers", async (_, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postSheetsPull();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchLanguagesSettings());
});

export const setStreamSettings: AsyncThunk<
	ApiResult<All<StreamDestinationSettings>>,
	All<StreamDestinationSettings>,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<StreamDestinationSettings>>, All<StreamDestinationSettings>, { state: RootState }>(
	"app/setStreamSettings",
	async (streamSettings, { rejectWithValue }) => {
		const result = await ApiService.postStreamSettings(streamSettings);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const startStreaming: AsyncThunk<
	ApiResult<string[]>,
	string[] | undefined,
	{ state: RootState }
> = createAsyncThunk<ApiResult<string[]>, string[] | undefined, { state: RootState }>(
	"app/startStreaming",
	async (languages, { getState, rejectWithValue }) => {
		const languagesSet = Array.isArray(languages);
		const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

		const result = await ApiService.postStreamStart(affectedLanguages);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const stopStreaming: AsyncThunk<string[], string[] | undefined, { state: RootState }> = createAsyncThunk<
	string[],
	string[] | undefined,
	{ state: RootState }
>("app/stopStreaming", async (languages, { getState, rejectWithValue }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

	const result = await ApiService.postStreamStop(affectedLanguages);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return affectedLanguages;
});

const processSynchronization = <T extends All<number>>(
	settings: T,
	syncAllLanguages: boolean,
	languagesSettings: LanguagesSettings
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

export const setSourceVolume: AsyncThunk<
	ApiResult<All<SourceVolumeSettings>>,
	All<SourceVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<SourceVolumeSettings>>, All<SourceVolumeSettings>, { state: RootState }>(
	"app/setSourceVolume",
	async (volumeSettings, { getState, rejectWithValue }) => {
		const { app } = getState();

		const specifiedVolumeSettings = processSynchronization(
			volumeSettings,
			app.syncedParameters.sourceVolume,
			app.languagesSettings
		);

		const result = await ApiService.postSourceVolume(specifiedVolumeSettings);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const setTranslationVolume: AsyncThunk<
	ApiResult<All<TranslationVolumeSettings>>,
	All<TranslationVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<TranslationVolumeSettings>>, All<TranslationVolumeSettings>, { state: RootState }>(
	"app/setTranslationVolume",
	async (volumeSettings, { getState, rejectWithValue }) => {
		const { app } = getState();

		const specifiedVolumeSettings = processSynchronization(
			volumeSettings,
			app.syncedParameters.translationVolume,
			app.languagesSettings
		);

		const result = await ApiService.postTsVolume(specifiedVolumeSettings);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const setTranslationOffset: AsyncThunk<
	ApiResult<All<TranslationOffsetSettings>>,
	All<TranslationOffsetSettings>,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<TranslationOffsetSettings>>, All<TranslationOffsetSettings>, { state: RootState }>(
	"app/setTranslationOffset",
	async (offsetSettings, { getState, rejectWithValue }) => {
		const { app } = getState();

		const specifiedOffsetSettings = processSynchronization(
			offsetSettings,
			app.syncedParameters.translationOffset,
			app.languagesSettings
		);

		const result = await ApiService.postTsOffset(specifiedOffsetSettings);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const setSidechain: AsyncThunk<
	ApiResult<All<Partial<SidechainSettings>>>,
	All<Partial<SidechainSettings>>,
	{ state: RootState }
> = createAsyncThunk<ApiResult<All<Partial<SidechainSettings>>>, All<Partial<SidechainSettings>>, { state: RootState }>(
	"app/setSidechain",
	async (sidechainSettings, { rejectWithValue }) => {
		const result = await ApiService.postUpdateFiltersSidechain(sidechainSettings);

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const setTransition: AsyncThunk<
	ApiResult<All<Partial<TransitionSettings>>>,
	All<Partial<TransitionSettings>>,
	{ state: RootState }
> = createAsyncThunk<
	ApiResult<All<Partial<TransitionSettings>>>,
	All<Partial<TransitionSettings>>,
	{ state: RootState }
>("app/setTransition", async (transitionSettings, { rejectWithValue }) => {
	const result = await ApiService.postTransition(transitionSettings);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
});

export const syncGoogleDrive: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/syncGoogleDrive", async (_, { getState, rejectWithValue }) => {
	const { app } = getState();
	const gDriveSettings = getAllGDriveSettings(app.languagesSettings);

	const result = await ApiService.postGDriveSync(gDriveSettings);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
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
	},
	extraReducers: (builder) =>
		builder
			.addCase(initialize.pending, (state) => {
				state.activeRequest = "postInit";
			})
			.addCase(initialize.fulfilled, (state) => {
				state.activeRequest = null;
				state.initialLanguageSettingsLoaded = true;
			})
			.addCase(fetchLanguagesSettings.pending, (state) => {
				state.initialLanguageSettingsLoaded = false;
			})
			.addCase(fetchLanguagesSettings.fulfilled, (state, { payload }) => {
				if (payload.data) {
					Object.keys(payload.data).forEach((lang) => {
						state.initialized = true;
						const languageSettings = payload.data?.[lang] as GlobalSettings | "#";

						if (languageSettings === "#") {
							state.languagesSettings[lang] = EMPTY_LANGUAGE_SETTINGS;
							state.initialized = false;
						} else {
							const streamParameters: StreamParametersSettings = {
								streamActive: languageSettings.stream_on?.value,
								sourceVolume: languageSettings.source_volume?.value,
								translationVolume: languageSettings.ts_volume?.value,
								translationOffset: languageSettings.ts_offset?.value,
							};

							state.languagesSettings[lang] = {
								initial: languageSettings.server_langs,
								sidechain: languageSettings.sidechain,
								gDrive: languageSettings.gdrive_settings,
								streamDestination: languageSettings.stream_settings,
								transition: languageSettings.transition,
								streamParameters,
							};
						}
					});
				}
				state.initialLanguageSettingsLoaded = true;
			})
			.addCase(cleanup.pending, (state) => {
				state.activeRequest = "postCleanup";
			})
			.addCase(cleanup.fulfilled, (state) => {
				state.activeRequest = null;
			})
			.addCase(setStreamSettings.fulfilled, (state, { payload }) => {
				const streamSettings = payload.data;
				if (streamSettings) {
					Object.keys(streamSettings).forEach((language) => {
						const destination = streamSettings[language];
						state.languagesSettings[language].streamDestination = destination;
					});
				}
			})
			.addCase(startStreaming.fulfilled, (state, { payload }) => {
				const languages = payload.data;
				if (languages) {
					languages.forEach((language) => {
						state.languagesSettings[language].streamParameters.streamActive = true;
					});
				}
			})
			.addCase(stopStreaming.fulfilled, (state, { payload: languages }) => {
				languages.forEach((language) => {
					state.languagesSettings[language].streamParameters.streamActive = false;
				});
			})
			.addCase(setSourceVolume.fulfilled, (state, { payload: volumeSettings }) => {
				for (const language in volumeSettings.data) {
					const sourceVolume = volumeSettings.data[language];
					state.languagesSettings[language].streamParameters.sourceVolume = sourceVolume;
				}
			})
			.addCase(setTranslationVolume.fulfilled, (state, { payload: volumeSettings }) => {
				for (const language in volumeSettings.data) {
					const translationVolume = volumeSettings.data[language];
					state.languagesSettings[language].streamParameters.translationVolume = translationVolume;
				}
			})
			.addCase(setTranslationOffset.fulfilled, (state, { payload: offsetSettings }) => {
				for (const language in offsetSettings.data) {
					const translationOffset = offsetSettings.data[language] as number;
					state.languagesSettings[language].streamParameters.translationOffset = translationOffset;
				}
			})
			.addCase(setSidechain.fulfilled, (state, { payload: sidechainSettings }) => {
				for (const language in sidechainSettings.data) {
					const updatedSidechainSettings = sidechainSettings.data[language];
					state.languagesSettings[language].sidechain = {
						...state.languagesSettings[language].sidechain,
						...updatedSidechainSettings,
					};
				}
			})
			.addCase(setTransition.fulfilled, (state, { payload: transitionSettings }) => {
				for (const language in transitionSettings.data) {
					const updatedTransitionSettings = transitionSettings.data[language];
					state.languagesSettings[language].transition = {
						...state.languagesSettings[language].transition,
						...updatedTransitionSettings,
					};
				}
			}),
});

export const { updateActiveRequest, updateSyncedParameters } = actions;

export const selectInitialized: RootSelector<boolean> = ({ app }) => app.initialized;

export const selectInitialLanguagesSettingsLoaded: RootSelector<boolean> = ({ app }) =>
	app.initialLanguageSettingsLoaded;

export const selectActiveRequest: RootSelector<ActiveRequest | null> = ({ app }) => app.activeRequest;

export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectLanguagesSettings: RootSelector<LanguagesSettings> = ({ app }) => app.languagesSettings;

export default reducer;
