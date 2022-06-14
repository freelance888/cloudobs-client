import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectStatus } from "../store/slices/app";

const STATUS_BAR_TIMEOUT_MS = 8000;

const StatusBar = () => {
	const status = useSelector(selectStatus);

	const [classes, setClasses] = useState("");
	const [text, setText] = useState("");

	useEffect(() => {
		const { type, message } = status;

		if (type === "none") {
			return;
		}

		const statusClasses = type === "error" ? "error" : "success";

		setClasses(`${statusClasses} show`);
		setText(message);

		setTimeout(() => {
			setClasses(statusClasses);
		}, STATUS_BAR_TIMEOUT_MS);
	}, [status]);

	return <div className={`status-bar ${classes}`}>{text}</div>;
};

export default StatusBar;
