import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ApiService from "../../services/api/index";
import { ApiResult } from "../../services/api/types";
import { createApiResult } from "../../services/api/utils";
import {
	All,
	MediaPlaySettings,
	MediaSchedule,
	MediaScheduleItem,
	NewMediaSchedule,
	UpdatedMediaScheduleItem,
} from "../../services/types";
import { generateId } from "../../utils/generateId";
import { RootSelector, RootState } from "../store";

type MediaScheduleState = {
	mediaSchedule: MediaSchedule;
};

const initialState: MediaScheduleState = {
	mediaSchedule: {},
};

export const fetchMediaSchedule: AsyncThunk<ApiResult<MediaSchedule>, void, { state: RootState }> = createAsyncThunk<
	ApiResult<MediaSchedule>,
	void,
	{ state: RootState }
>("app/fetchMediaSchedule", async (_, { rejectWithValue }) => {
	const result = await ApiService.getMediaSchedule();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	if (result.data && Object.keys(result.data).length === 0) {
		const gdriveFilesResult = await ApiService.getGDriveFiles(0);

		console.log("# gdriveFilesResult.data?.__all__", gdriveFilesResult.data?.__all__);

		const newMediaSchedule: MediaSchedule = {};

		gdriveFilesResult.data?.__all__.forEach((gdriveFile) => {
			const [name] = gdriveFile;

			const id = generateId();
			console.log("# gdriveFile", id, name);

			newMediaSchedule[generateId()] = {
				name,
				timestamp: String(0),
				is_enabled: true,
				is_played: false,
			};
		});

		return createApiResult(newMediaSchedule);
	}

	return result;
});

export const setMediaSchedule: AsyncThunk<void, NewMediaSchedule, { state: RootState }> = createAsyncThunk<
	void,
	NewMediaSchedule,
	{ state: RootState }
>("app/setMediaSchedule", async (videoSchedule, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postMediaSchedule(videoSchedule);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchMediaSchedule());
});

export const updateMedia: AsyncThunk<void, UpdatedMediaScheduleItem, { state: RootState }> = createAsyncThunk<
	void,
	UpdatedMediaScheduleItem,
	{ state: RootState }
>("app/updateMedia", async (mediaScheduleItem, { dispatch, rejectWithValue }) => {
	const result = await ApiService.putMediaSchedule(mediaScheduleItem);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchMediaSchedule());
});

export const resetMediaSchedule: AsyncThunk<void, never, { state: RootState }> = createAsyncThunk<
	void,
	never,
	{ state: RootState }
>("app/resetMediaSchedule", async (ignored, { dispatch, rejectWithValue }) => {
	const result = await ApiService.deleteMediaSchedule();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchMediaSchedule());
});

export const playMedia: AsyncThunk<void, MediaScheduleItem, { state: RootState }> = createAsyncThunk<
	void,
	MediaScheduleItem,
	{ state: RootState }
>("app/playMedia", async (mediaScheduleItem, { rejectWithValue }) => {
	const mediaNamePrefix = mediaScheduleItem.name.split(/^([0-9]+)_.+/)[1];

	const mediaPlaySettings: All<MediaPlaySettings> = { __all__: { name: mediaNamePrefix, search_by_num: 1 } };

	const result = await ApiService.postMediaPlay(mediaPlaySettings);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
});

export const stopMedia: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/stopMedia", async (ignored, { rejectWithValue }) => {
	const result = await ApiService.deleteMediaPlay();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
});

const { reducer } = createSlice({
	name: "app",
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder.addCase(fetchMediaSchedule.fulfilled, (state, { payload }) => {
			const mediaSchedule = payload.data as MediaSchedule;
			state.mediaSchedule = mediaSchedule;
		}),
	// .addCase(playMedia.fulfilled, (state, { payload }) => {
	// 	const videoIndex = Object.values(state.mediaSchedule).findIndex(({ name }) => name === payload);
	// 	state.mediaSchedule[videoIndex].is_played = true;
	// }),
});

export const selectMediaSchedule: RootSelector<MediaSchedule> = ({ mediaSchedule }) => mediaSchedule.mediaSchedule;

export default reducer;
