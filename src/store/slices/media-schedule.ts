import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ApiService from "../../services/api/index";
import {
	All,
	MediaPlaySettings,
	MediaSchedule,
	NewMediaSchedule,
	UpdatedMediaScheduleItem,
} from "../../services/types";
import { RootSelector, RootState } from "../store";
import { fetchMediaSchedule } from "./app";

type MediaScheduleState = {
	mediaSchedule: MediaSchedule;
};

const initialState: MediaScheduleState = {
	mediaSchedule: {},
};

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

export const playMedia: AsyncThunk<string, string, { state: RootState }> = createAsyncThunk<
	string,
	string,
	{ state: RootState }
>("app/playMedia", async (videoName, { rejectWithValue }) => {
	const mediaPlaySettings: All<MediaPlaySettings> = { __all__: { name: videoName, search_by_num: 0 } };

	const result = await ApiService.postMediaPlay(mediaPlaySettings);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return videoName;
});

export const stopMedia: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("app/playMedia", async (ignored, { rejectWithValue }) => {
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
		builder
			.addCase(playMedia.fulfilled, (state, { payload }) => {
				const videoIndex = Object.values(state.mediaSchedule).findIndex(({ name }) => name === payload);
				state.mediaSchedule[videoIndex].is_played = true;
			})
			.addCase(fetchMediaSchedule.fulfilled, (state, { payload }) => {
				const mediaSchedule = payload.data as MediaSchedule;
				state.mediaSchedule = mediaSchedule;
			}),
});

export const selectMediaSchedule: RootSelector<MediaSchedule> = ({ mediaSchedule }) => mediaSchedule.mediaSchedule;

export default reducer;
