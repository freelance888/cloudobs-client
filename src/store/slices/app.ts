import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, Selector } from "@reduxjs/toolkit";
import { loadHostAddress } from "../../components/EnvironmentSettings";
import * as ApiService from "../../services/api";
import { ApiResult } from "../../services/api";
import { EMPTY_LANGUAGE_SETTINGS } from "../../services/emptyData";
import {
	All,
	getAllGDriveSettings,
	getAllInitialSettings,
	GlobalSettings,
	LanguagesSettings,
	MediaPlaySettings,
	SidechainSettings,
	SourceVolumeSettings,
	StreamDestinationSettings,
	StreamParametersSettings,
	SyncableSettingsFlags,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
	VideoSchedule,
} from "../../services/types";
import { AppDispatch, RootState } from "../store";
import { logMessage } from "./logs";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
};

type StatusType = "none" | "error" | "success";
type Status = {
	type: StatusType;
	message: string;
};

type ActiveRequest = keyof typeof ApiService;

type AppState = {
	initialLanguageSettingsLoaded: boolean;
	streamParametersLoaded: boolean;
	status: Status;
	hostAddress: HostAddress;
	activeRequest: ActiveRequest | null;
	syncedParameters: SyncableSettingsFlags;
	languagesSettings: LanguagesSettings;
	videoSchedule: VideoSchedule;
};

const initialState: AppState = {
	initialLanguageSettingsLoaded: false,
	streamParametersLoaded: false,
	status: {
		type: "none",
		message: "",
	},
	hostAddress: loadHostAddress(),
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
	videoSchedule: [],
};

const getAllLanguages: (state: RootState) => string[] = (state) => {
	return Object.keys(state.app.languagesSettings);
};

const processStatus = async (dispatch: AppDispatch, result: ApiResult) => {
	const { messages } = result;

	if (result.status === "success") {
		const message = messages?.success || "Success";
		dispatch(updateStatus({ type: "success", message }));
		dispatch(logMessage({ text: message, severity: "success" }));
	} else {
		const message = messages?.error || "Error";
		dispatch(updateStatus({ type: "error", message }));
		dispatch(logMessage({ text: message, severity: "error" }));
	}
};

const fetchInitialSettings = async (dispatch: AppDispatch): Promise<All<GlobalSettings>> => {
	// const result = await ApiService.getInit();
	const result = await ApiService.getInfo();
	processStatus(dispatch, result);
	return result.data;
};

export const initialize: AsyncThunk<LanguagesSettings, LanguagesSettings, { state: RootState }> = createAsyncThunk<
	LanguagesSettings,
	LanguagesSettings,
	{ state: RootState }
>("app/initialize", async (languagesSettings, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postInit(getAllInitialSettings(languagesSettings));
	processStatus(dispatch as AppDispatch, result);

	if (result.status === "error") {
		return rejectWithValue(result);
	}

	return languagesSettings;
});

export const initializeV2: AsyncThunk<void, { sheetUrl: string; worksheetName: string }, { state: RootState }> =
	createAsyncThunk<void, { sheetUrl: string; worksheetName: string }, { state: RootState }>(
		"app/initializeV2",
		async (data, { dispatch }) => {
			const result = await ApiService.postInitV2(data);
			processStatus(dispatch as AppDispatch, result);
		}
	);

export const fetchLanguagesSettings: AsyncThunk<
	All<GlobalSettings | "#">,
	void,
	{ state: RootState }
> = createAsyncThunk<All<GlobalSettings | "#">, void, { state: RootState }>(
	"app/fetchCurrentSettings",
	async (_, { dispatch }) => {
		return fetchInitialSettings(dispatch as AppDispatch);
	}
);

export const cleanup: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<void, void, { state: RootState }>(
	"app/cleanup",
	async (_, { dispatch }) => {
		const result = await ApiService.postCleanup();
		processStatus(dispatch as AppDispatch, result);
	}
);

export const setStreamSettings: AsyncThunk<
	All<StreamDestinationSettings>,
	All<StreamDestinationSettings>,
	{ state: RootState }
> = createAsyncThunk<All<StreamDestinationSettings>, All<StreamDestinationSettings>, { state: RootState }>(
	"app/setStreamSettings",
	async (streamSettings, { dispatch }) => {
		const result = await ApiService.postStreamSettings(streamSettings);
		processStatus(dispatch as AppDispatch, result);

		return streamSettings;
	}
);

export const startStreaming: AsyncThunk<string[], string[] | undefined, { state: RootState }> = createAsyncThunk<
	string[],
	string[] | undefined,
	{ state: RootState }
>("app/startStreaming", async (languages, { dispatch, getState }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

	const result = await ApiService.postStreamStart(affectedLanguages);
	processStatus(dispatch as AppDispatch, result);

	return affectedLanguages;
});

export const stopStreaming: AsyncThunk<string[], string[] | undefined, { state: RootState }> = createAsyncThunk<
	string[],
	string[] | undefined,
	{ state: RootState }
>("app/stopStreaming", async (languages, { dispatch, getState }) => {
	const languagesSet = Array.isArray(languages);
	const affectedLanguages = languagesSet ? languages : getAllLanguages(getState());

	const result = await ApiService.postStreamStop(affectedLanguages);
	processStatus(dispatch as AppDispatch, result);

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
	All<SourceVolumeSettings>,
	All<SourceVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<All<SourceVolumeSettings>, All<SourceVolumeSettings>, { state: RootState }>(
	"app/setSourceVolume",
	async (volumeSettings, { dispatch, getState }) => {
		const { app } = getState();

		const specifiedVolumeSettings = processSynchronization(
			volumeSettings,
			app.syncedParameters.sourceVolume,
			app.languagesSettings
		);

		const result = await ApiService.postSourceVolume(specifiedVolumeSettings);
		processStatus(dispatch as AppDispatch, result);

		return specifiedVolumeSettings;
	}
);

export const setTranslationVolume: AsyncThunk<
	All<TranslationVolumeSettings>,
	All<TranslationVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<All<TranslationVolumeSettings>, All<TranslationVolumeSettings>, { state: RootState }>(
	"app/setTranslationVolume",
	async (volumeSettings, { dispatch, getState }) => {
		const { app } = getState();

		const specifiedVolumeSettings = processSynchronization(
			volumeSettings,
			app.syncedParameters.translationVolume,
			app.languagesSettings
		);

		const result = await ApiService.postTsVolume(specifiedVolumeSettings);
		processStatus(dispatch as AppDispatch, result);

		return specifiedVolumeSettings;
	}
);

export const setTranslationOffset: AsyncThunk<
	All<TranslationOffsetSettings>,
	All<TranslationOffsetSettings>,
	{ state: RootState }
> = createAsyncThunk<All<TranslationOffsetSettings>, All<TranslationOffsetSettings>, { state: RootState }>(
	"app/setTranslationOffset",
	async (offsetSettings, { dispatch, getState }) => {
		const { app } = getState();

		const specifiedOffsetSettings = processSynchronization(
			offsetSettings,
			app.syncedParameters.translationOffset,
			app.languagesSettings
		);

		const result = await ApiService.postTsOffset(specifiedOffsetSettings);
		processStatus(dispatch as AppDispatch, result);

		return specifiedOffsetSettings;
	}
);

export const setSidechain: AsyncThunk<
	All<Partial<SidechainSettings>>,
	All<Partial<SidechainSettings>>,
	{ state: RootState }
> = createAsyncThunk<All<Partial<SidechainSettings>>, All<Partial<SidechainSettings>>, { state: RootState }>(
	"app/setSidechain",
	async (sidechainSettings, { dispatch }) => {
		const result = await ApiService.postUpdateFiltersSidechain(sidechainSettings);
		processStatus(dispatch as AppDispatch, result);

		return sidechainSettings;
	}
);

export const setVideoSchedule: AsyncThunk<VideoSchedule, VideoSchedule, { state: RootState }> = createAsyncThunk<
	VideoSchedule,
	VideoSchedule,
	{ state: RootState }
>("app/setVideoSchedule", async (videoSchedule, { dispatch }) => {
	const result = await ApiService.postMediaSchedule(videoSchedule);
	processStatus(dispatch as AppDispatch, result);

	return videoSchedule;
});

export const playMedia: AsyncThunk<string, string, { state: RootState }> = createAsyncThunk<
	string,
	string,
	{ state: RootState }
>("app/playMedia", async (videoName, { dispatch }) => {
	const mediaPlaySettings: All<MediaPlaySettings> = { __all__: { name: videoName, search_by_num: 0 } };

	const result = await ApiService.postMediaPlay(mediaPlaySettings);
	processStatus(dispatch as AppDispatch, result);

	return videoName;
});

export const syncGoogleDrive: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/syncGoogleDrive", async (_, { dispatch, getState }) => {
	const { app } = getState();
	const gDriveSettings = getAllGDriveSettings(app.languagesSettings);

	const result = await ApiService.postGDriveSync(gDriveSettings);
	processStatus(dispatch as AppDispatch, result);
});

const { actions, reducer } = createSlice({
	name: "app",
	initialState,
	reducers: {
		updateStatus(state, { payload }: PayloadAction<Status>) {
			state.status = payload;
		},
		updateHostAddress(state, { payload }: PayloadAction<HostAddress>) {
			state.hostAddress = payload;
		},
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
			.addCase(initialize.fulfilled, (state, { payload }) => {
				state.activeRequest = null;
				state.languagesSettings = payload;
				state.initialLanguageSettingsLoaded = true;
			})
			.addCase(initialize.rejected, (state) => {
				state.activeRequest = null;
			})
			.addCase(initializeV2.pending, (state) => {
				state.activeRequest = "postInit";
			})
			.addCase(initializeV2.fulfilled, (state) => {
				state.activeRequest = null;
				state.initialLanguageSettingsLoaded = true;
			})
			.addCase(fetchLanguagesSettings.pending, (state) => {
				state.initialLanguageSettingsLoaded = false;
			})
			.addCase(fetchLanguagesSettings.fulfilled, (state, { payload }) => {
				Object.keys(payload).forEach((lang) => {
					const languageSettings = payload[lang];

					if (languageSettings === "#") {
						state.languagesSettings[lang] = EMPTY_LANGUAGE_SETTINGS;
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
							streamParameters,
						};
					}
				});
				state.initialLanguageSettingsLoaded = true;
			})
			.addCase(cleanup.pending, (state) => {
				state.activeRequest = "postCleanup";
			})
			.addCase(cleanup.fulfilled, (state) => {
				state.activeRequest = null;
			})
			.addCase(setStreamSettings.fulfilled, (state, { payload: streamSettings }) => {
				Object.keys(streamSettings).forEach((language) => {
					const destination = streamSettings[language];
					state.languagesSettings[language].streamDestination = destination;
				});
			})
			.addCase(startStreaming.fulfilled, (state, { payload: languages }) => {
				languages.forEach((language) => {
					state.languagesSettings[language].streamParameters.streamActive = true;
				});
			})
			.addCase(stopStreaming.fulfilled, (state, { payload: languages }) => {
				languages.forEach((language) => {
					state.languagesSettings[language].streamParameters.streamActive = false;
				});
			})
			.addCase(setSourceVolume.fulfilled, (state, { payload: volumeSettings }) => {
				for (const language in volumeSettings) {
					const sourceVolume = volumeSettings[language];
					state.languagesSettings[language].streamParameters.sourceVolume = sourceVolume;
				}
			})
			.addCase(setTranslationVolume.fulfilled, (state, { payload: volumeSettings }) => {
				for (const language in volumeSettings) {
					const translationVolume = volumeSettings[language];
					state.languagesSettings[language].streamParameters.translationVolume = translationVolume;
				}
			})
			.addCase(setTranslationOffset.fulfilled, (state, { payload: offsetSettings }) => {
				for (const language in offsetSettings) {
					const translationOffset = offsetSettings[language];
					state.languagesSettings[language].streamParameters.translationOffset = translationOffset;
				}
			})
			.addCase(setSidechain.fulfilled, (state, { payload: sidechainSettings }) => {
				for (const language in sidechainSettings) {
					const updatedSidechainSettings = sidechainSettings[language];
					state.languagesSettings[language].sidechain = {
						...state.languagesSettings[language].sidechain,
						...updatedSidechainSettings,
					};
				}
			})
			.addCase(setVideoSchedule.fulfilled, (state, { payload }) => {
				state.videoSchedule = payload;
			})
			.addCase(playMedia.fulfilled, (state, { payload }) => {
				const videoIndex = state.videoSchedule.findIndex((videoRecord) => videoRecord.name === payload);
				state.videoSchedule[videoIndex].alreadyPlayed = true;
			}),
});

export const { updateStatus, updateActiveRequest, updateHostAddress, updateSyncedParameters } = actions;

export const selectInitialLanguagesSettingsLoaded: Selector<RootState, boolean> = ({ app }) =>
	app.initialLanguageSettingsLoaded;

export const selectActiveRequest: Selector<RootState, ActiveRequest | null> = ({ app }) => app.activeRequest;

export const selectSyncedParameters: Selector<RootState, SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectHostAddress: Selector<RootState, HostAddress> = ({ app }) => app.hostAddress;

export const selectStatus: Selector<RootState, Status> = ({ app }) => app.status;

export const selectLanguagesSettings: Selector<RootState, LanguagesSettings> = ({ app }) => app.languagesSettings;

export const selectVideoSchedule: Selector<RootState, VideoSchedule> = ({ app }) => app.videoSchedule;

export default reducer;
