import { useCallback } from "react";

import { useDispatch } from "react-redux";

import { logMessage } from "../store/slices/logs";
import { AppDispatch } from "../store/store";

const useLogger = () => {
	const dispatch = useDispatch<AppDispatch>();

	const logSuccess: (text: string) => void = useCallback(
		(text) => {
			dispatch(logMessage({ text, severity: "success" }));
		},
		[dispatch]
	);

	const logError: (text: string) => void = useCallback(
		(text) => {
			dispatch(logMessage({ text, severity: "error" }));
		},
		[dispatch]
	);

	return { logSuccess, logError };
};

export default useLogger;
