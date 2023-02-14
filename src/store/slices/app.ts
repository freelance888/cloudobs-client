import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as ApiService from "../../services/api/index";
import {
	LangMap,
	GDriveFile,
	LanguagesSettings,
	MinionConfig,
	Registry,
	SourceVolumeSettings,
	SyncableSettingsFlags,
	TransitionSettings,
	TranslationOffsetSettings,
	TranslationVolumeSettings,
} from "../../services/types";
import { RootSelector, RootState } from "../store";
import {
	setSourceVolume as setSourceVolumeSocket,
	setTeamspeakOffset,
	setTeamspeakVolume,
	setTransitionSettings,
} from "../../services/soketApi";

type ActiveRequest = keyof typeof ApiService;

type AppState = {
	initialized: boolean;
	initialLanguageSettingsLoaded: boolean;
	streamParametersLoaded: boolean;
	activeRequest: ActiveRequest | null;
	syncedParameters: SyncableSettingsFlags;
	languagesSettings: LanguagesSettings;
	videoData: LangMap<GDriveFile[]>;
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

const processSynchronization = <T extends LangMap<number>>(
	settings: T,
	syncAllLanguages: boolean,
	languagesSettings: LangMap<MinionConfig>
) => {
	const value = Object.values(settings)?.[0];
	let specifiedSettings: LangMap<typeof value> = {};

	if (syncAllLanguages) {
		for (const language in languagesSettings) {
			specifiedSettings[language] = value;
		}
	} else {
		specifiedSettings = settings;
	}

	return specifiedSettings;
};

export const setSourceVolume: AsyncThunk<void, LangMap<SourceVolumeSettings>, { state: RootState }> = createAsyncThunk<
	void,
	LangMap<SourceVolumeSettings>,
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
	LangMap<TranslationVolumeSettings>,
	{ state: RootState }
> = createAsyncThunk<void, LangMap<TranslationVolumeSettings>, { state: RootState }>(
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
	LangMap<TranslationOffsetSettings>,
	{ state: RootState }
> = createAsyncThunk<void, LangMap<TranslationOffsetSettings>, { state: RootState }>(
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

export const setTransition: AsyncThunk<
	void,
	LangMap<Partial<TransitionSettings>>,
	{ state: RootState }
> = createAsyncThunk<void, LangMap<Partial<TransitionSettings>>, { state: RootState }>(
	"app/setTransition",
	async (transitionSettings) => {
		Object.entries(transitionSettings).forEach(([language, settings]) => {
			setTransitionSettings(settings?.transition_point, language);
		});
	}
);

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
});

export const { updateSyncedParameters, updateRegistry } = actions;

export const selectActiveRequest: RootSelector<ActiveRequest | null> = ({ app }) => app.activeRequest;

export const selectSyncedParameters: RootSelector<SyncableSettingsFlags> = ({ app }) => app.syncedParameters;

export const selectLanguagesSettings: RootSelector<LanguagesSettings> = ({ app }) => app.languagesSettings;

export const selectVideosData: RootSelector<LangMap<GDriveFile[]>> = ({ app }) => app.videoData;

export const selectRegistry: RootSelector<any> = ({ app }) => app.registry;

export default reducer;
