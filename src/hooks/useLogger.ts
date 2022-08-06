import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logMessage } from "../store/slices/logs";

const useLogger = () => {
	const dispatch = useDispatch();

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
