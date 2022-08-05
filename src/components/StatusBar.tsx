import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLogMessages } from "../store/slices/logs";

const STATUS_BAR_TIMEOUT_MS = 8000;

const StatusBar = () => {
	const logMessages = useSelector(selectLogMessages);
	const navigate = useNavigate();

	const [classes, setClasses] = useState("");
	const [statusText, setStatusText] = useState("");

	const latestLogMessage = logMessages?.[0] ?? null;

	useEffect(() => {
		if (!latestLogMessage) {
			return;
		}

		const { text, severity } = latestLogMessage;

		const statusClasses = severity === "error" ? "error" : "success";

		setClasses(`${statusClasses} show`);
		setStatusText(text);

		setTimeout(() => {
			setClasses(statusClasses);
		}, STATUS_BAR_TIMEOUT_MS);
	}, [latestLogMessage]);

	return (
		<div
			className={`status-bar ${classes}`}
			onClick={() => {
				navigate("/logs", { replace: true });
			}}
		>
			{statusText}
		</div>
	);
};

export default StatusBar;
