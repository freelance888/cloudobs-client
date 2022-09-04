import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateId } from "../../utils/generateId";
import { RootSelector } from "../store";

type LogMessageSeverity = "success" | "error" | "warn" | "log";

type LogMessage = {
	id: string;
	text: string;
	timestamp: string;
	severity: LogMessageSeverity;
};

type LogsState = {
	messages: LogMessage[];
};

const MAX_MESSAGES = 100;

const buildMessage = (text: string, severity?: LogMessageSeverity): LogMessage => {
	return {
		id: generateId(),
		text,
		timestamp: new Date().toLocaleString(),
		severity: severity || "log",
	};
};

const initialState: LogsState = {
	messages: [],
};

const { actions, reducer } = createSlice({
	name: "logs",
	initialState,
	reducers: {
		logMessage(state, { payload }: PayloadAction<string | { text: string; severity: LogMessageSeverity }>) {
			if (state.messages.length >= MAX_MESSAGES) {
				state.messages.shift();
			}

			let message: LogMessage;
			if (typeof payload === "string") {
				message = buildMessage(payload);
			} else {
				const { text, severity } = payload;
				message = buildMessage(text, severity);
			}

			state.messages.unshift(message);
		},
	},
});

export const { logMessage } = actions;

export const selectLogMessages: RootSelector<LogMessage[]> = ({ logs }) => logs.messages;

export default reducer;
