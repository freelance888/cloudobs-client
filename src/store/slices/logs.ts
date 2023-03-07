import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootSelector } from "../store";

export const MAX_MESSAGES = 200;

type LogMessageSeverity = "info" | "warn" | "error";

type Log = {
	level: LogMessageSeverity;
	type: string;
	message: string;
	error: string | null;
	timestamp: string;
	extra: {
		minion_ip: string;
		minion_lang: string;
		command: string;
		details: string;
		lang: string;
		ip: string;
	};
};

type LogsState = {
	messages: Log[];
};

const initialState: LogsState = {
	messages: [],
};

const { actions, reducer } = createSlice({
	name: "logs",
	initialState,
	reducers: {
		addNewLog(state, { payload }: PayloadAction<Log>) {
			if (state.messages.length >= MAX_MESSAGES) {
				state.messages.shift();
			}
			state.messages.push(payload);
		},
		setLogs(state, { payload }: PayloadAction<Log[]>) {
			state.messages = payload;
		},
	},
});

export const { addNewLog, setLogs } = actions;

export const selectLogMessages: RootSelector<Log[]> = ({ logs }) => logs.messages;

export default reducer;
