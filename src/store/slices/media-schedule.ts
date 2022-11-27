import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ApiService from "../../services/api/index";
import { ApiResult } from "../../services/api/types";
import {
	All,
	MediaPlaySettings,
	MediaSchedule,
	MediaScheduleItem,
	MediaScheduleStatus,
	NewMediaSchedule,
	SheetInitialSettings,
	UpdatedMediaScheduleItem,
} from "../../services/types";
import { parseTimestamps } from "../../utils/timestamp";
import { RootSelector, RootState } from "../store";

type MediaScheduleState = {
	mediaSchedule: MediaSchedule;
	mediaScheduleStatus: MediaScheduleStatus;
};

const initialState: MediaScheduleState = {
	mediaSchedule: {},
	mediaScheduleStatus: { running: false, timestamp: "" },
};

export const setupMediaSchedule: AsyncThunk<ApiResult, SheetInitialSettings, { state: RootState }> = createAsyncThunk<
	ApiResult,
	SheetInitialSettings,
	{ state: RootState }
>("media-schedule/setupMediaSchedule", async (data, { rejectWithValue }) => {
	const result = await ApiService.postMediaScheduleSetup(data);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
});

export const fetchMediaSchedule: AsyncThunk<ApiResult<MediaSchedule>, void, { state: RootState }> = createAsyncThunk<
	ApiResult<MediaSchedule>,
	void,
	{ state: RootState }
>("media-schedule/fetchMediaSchedule", async (_, { rejectWithValue }) => {
	const result = await ApiService.getMediaSchedule();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	// if (result.data && Object.keys(result.data).length === 0) {
	// 	const gdriveFilesResult = await ApiService.getGDriveFiles(0);

	// 	console.log("# gdriveFilesResult.data?.__all__", gdriveFilesResult.data?.__all__);

	// 	const newMediaSchedule: MediaSchedule = {};

	// 	gdriveFilesResult.data?.__all__.forEach((gdriveFile) => {
	// 		const [name] = gdriveFile;

	// 		const id = generateId();
	// 		console.log("# gdriveFile", id, name);

	// 		newMediaSchedule[generateId()] = {
	// 			name,
	// 			timestamp: String(0),
	// 			is_enabled: true,
	// 			is_played: false,
	// 		};
	// 	});

	// return createApiResult(newMediaSchedule);
	// }

	return result;
});

export const fetchTimingStatus: AsyncThunk<
	ApiResult<MediaScheduleStatus>,
	void,
	{ state: RootState }
> = createAsyncThunk<ApiResult<MediaScheduleStatus>, void, { state: RootState }>(
	"media-schedule/fetchTimingStatus",
	async (_, { rejectWithValue }) => {
		const result = await ApiService.getMediaScheduleStatus();

		if (result.status === "error") {
			return rejectWithValue(result.message);
		}

		return result;
	}
);

export const setMediaSchedule: AsyncThunk<void, NewMediaSchedule, { state: RootState }> = createAsyncThunk<
	void,
	NewMediaSchedule,
	{ state: RootState }
>("media-schedule/setMediaSchedule", async (videoSchedule, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postMediaSchedule(videoSchedule);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchMediaSchedule());
});

export const pullMediaSchedule: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("media-schedule/pullMediaSchedule", async (_, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postMediaSchedulePull();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchMediaSchedule());
});

export const updateMedia: AsyncThunk<void, UpdatedMediaScheduleItem, { state: RootState }> = createAsyncThunk<
	void,
	UpdatedMediaScheduleItem,
	{ state: RootState }
>("media-schedule/updateMedia", async (mediaScheduleItem, { dispatch, rejectWithValue }) => {
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
>("media-schedule/resetMediaSchedule", async (ignored, { dispatch, rejectWithValue }) => {
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
>("media-schedule/playMedia", async (mediaScheduleItem, { rejectWithValue }) => {
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
>("media-schedule/stopMedia", async (ignored, { rejectWithValue }) => {
	const result = await ApiService.deleteMediaPlay();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
});

const { reducer } = createSlice({
	name: "media-schedule",
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(fetchMediaSchedule.fulfilled, (state, { payload }) => {
				let mediaSchedule = payload.data as MediaSchedule;
				mediaSchedule = parseTimestamps(mediaSchedule);
				state.mediaSchedule = mediaSchedule;
			})
			.addCase(fetchTimingStatus.fulfilled, (state, { payload }) => {
				const timingStatus = payload.data as MediaScheduleStatus;
				state.mediaScheduleStatus = timingStatus;
			}),
	// .addCase(playMedia.fulfilled, (state, { payload }) => {
	// 	const videoIndex = Object.values(state.mediaSchedule).findIndex(({ name }) => name === payload);
	// 	state.mediaSchedule[videoIndex].is_played = true;
	// }),
});

export const selectMediaSchedule: RootSelector<MediaSchedule> = ({ mediaSchedule }) => mediaSchedule.mediaSchedule;
export const selectMediaScheduleStatus: RootSelector<MediaScheduleStatus> = ({ mediaSchedule }) =>
	mediaSchedule.mediaScheduleStatus;

export default reducer;
