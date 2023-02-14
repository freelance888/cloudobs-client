import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as ApiService from "../../services/api/index";
import {
	MediaSchedule,
	MediaScheduleStatus,
	SheetInitialSettings,
	UpdatedMediaScheduleItem,
} from "../../services/types";
import { RootSelector, RootState } from "../store";
import { pullTiming } from "../../services/soketApi";

type MediaScheduleState = {
	mediaSchedule: MediaSchedule;
	mediaScheduleStatus: MediaScheduleStatus;
};

const initialState: MediaScheduleState = {
	mediaSchedule: {},
	mediaScheduleStatus: { running: false, timestamp: "" },
};

export const setupMediaSchedule: AsyncThunk<void, SheetInitialSettings, { state: RootState }> = createAsyncThunk<
	void,
	SheetInitialSettings,
	{ state: RootState }
>("media-schedule/setupMediaSchedule", async ({ sheetUrl, worksheetName }) => {
	pullTiming(sheetUrl, worksheetName);
});

export const updateMedia: AsyncThunk<void, UpdatedMediaScheduleItem, { state: RootState }> = createAsyncThunk<
	void,
	UpdatedMediaScheduleItem,
	{ state: RootState }
>("media-schedule/updateMedia", async (mediaScheduleItem, { rejectWithValue }) => {
	const result = await ApiService.putMediaSchedule(mediaScheduleItem);
	//TODO find proper emit
	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
});

export const resetMediaSchedule: AsyncThunk<void, never, { state: RootState }> = createAsyncThunk<
	void,
	never,
	{ state: RootState }
>("media-schedule/resetMediaSchedule", async (ignored, { rejectWithValue }) => {
	const result = await ApiService.postMediaScheduleReset();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}
	//TODO find proper emit
});

const { reducer } = createSlice({
	name: "media-schedule",
	initialState,
	reducers: {},
	extraReducers: (builder) => builder,
	// .addCase(fetchMediaSchedule.fulfilled, (state, { payload }) => {
	// 	let mediaSchedule = payload.data as MediaSchedule;
	// 	mediaSchedule = parseTimestamps(mediaSchedule);
	// 	state.mediaSchedule = mediaSchedule;
	// })
	// .addCase(fetchTimingStatus.fulfilled, (state, { payload }) => {
	// 	const timingStatus = payload.data as MediaScheduleStatus;
	// 	state.mediaScheduleStatus = timingStatus;
	// }),
	// .addCase(playMedia.fulfilled, (state, { payload }) => {
	// 	const videoIndex = Object.values(state.mediaSchedule).findIndex(({ name }) => name === payload);
	// 	state.mediaSchedule[videoIndex].is_played = true;
	// }),
});

export const selectMediaSchedule: RootSelector<MediaSchedule> = ({ mediaSchedule }) => mediaSchedule.mediaSchedule;
export const selectMediaScheduleStatus: RootSelector<MediaScheduleStatus> = ({ mediaSchedule }) =>
	mediaSchedule.mediaScheduleStatus;

export default reducer;
