import { isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import { buildUrl } from "../services/utils";
import { HostAddress } from "./slices/environment";
import { logMessage } from "./slices/logs";
import { AppMiddleware } from "./store";

const isApiCallResultSuccessAction = (action: any) =>
	action.type.startsWith("app/") && action?.meta?.requestStatus === "fulfilled";

const isApiCallResultErrorAction = (action: any) =>
	(action.type.startsWith("app/") || action.type.startsWith("environment/")) && isRejectedWithValue(action);

export const loggerMiddleware: AppMiddleware =
	({ dispatch }) =>
	(next) =>
	(action) => {
		if (isApiCallResultSuccessAction(action)) {
			if (action?.payload?.message) {
				const { message } = action.payload;
				dispatch(logMessage({ text: message, severity: "success" }));
			}
		}

		if (isApiCallResultErrorAction(action)) {
			const message = action.payload;
			dispatch(logMessage({ text: message, severity: "error" }));
		}

		if (action.type === "environment/updateHostAddress") {
			const { payload } = action as PayloadAction<HostAddress>;
			const { useLocalhost } = payload;

			if (useLocalhost) {
				dispatch(logMessage({ text: `Use localhost for server address set`, severity: "success" }));
			} else {
				dispatch(logMessage({ text: `Host server address updated to: ${buildUrl(payload)}`, severity: "success" }));
			}
		}

		// if (action.type === "environment/setActiveVMixTriggerer") {
		// 	const triggerer = getState().environment.vMixPlayers.find((triggerer) => triggerer.id === action.payload);

		// 	const message = `Setting active vMix triggerer to: ${triggerer?.ipAddress}`;
		// 	dispatch(logMessage({ text: message, severity: "success" }));
		// }

		return next(action);
	};
