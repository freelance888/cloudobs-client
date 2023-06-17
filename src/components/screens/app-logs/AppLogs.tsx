import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLogMessages } from "../../../store/slices/logs";
import ContentPanel from "../../ContentPanel";

const LogMessage = ({ id, log, collapsed = false }) => {
	if (!log || !log.extra) {
		console.log("### LogMessage: invalid log", log);
		return null;
	}

	const { message, timestamp, level, type, error, extra = {} } = log;

	const { ip = "", minion_ip, minion_lang, command, details, lang, message: extraMessage } = extra;

	let prefix = "";
	switch (level) {
		case "info":
			prefix = "✅";
			break;
		case "error":
			prefix = "❌";
			break;
		case "warn":
			prefix = "⚠️";
			break;
	}

	useEffect(() => {
		setOpen(collapsed);
	}, [collapsed]);

	const [open, setOpen] = useState(collapsed);
	const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

	return (
		<div className="logs__message p-2 m-0" onClick={toggleOpen} key={id}>
			<div className="logs__message-title" style={{ userSelect: "none" }}>
				<span className="logs__message-timestamp me-1">
					<span className="logs_message-prefix me-1">{prefix}</span>[
					{new Date(timestamp).toLocaleTimeString([], { hour12: false })}]
				</span>
				<span className="logs__message-text me-1">
					<b>{ip}</b>
				</span>
				<span className="logs__message-text">
					<i>{message}</i>
				</span>
			</div>
			{open && (
				<div>
					<div className="card card-body">
						<div>
							{type && (
								<span className="logs__message-text">
									{"Type: " + type}
									<br />
								</span>
							)}
							{error && (
								<span className="logs__message-text">
									{"Error: " + error}
									<br />
								</span>
							)}
							{minion_ip && (
								<span className="logs__message-text">
									{"Minion IP: " + minion_ip}
									<br />
								</span>
							)}
							{minion_lang && (
								<span className="logs__message-text">
									{"Minion Lang: " + minion_lang}
									<br />
								</span>
							)}
							{command && (
								<span className="logs__message-text">
									{"Command: " + command}
									<br />
								</span>
							)}
							{details && Object.keys(details).length > 0 && (
								<span className="logs__message-text">
									{"Details: " + JSON.stringify(details)}
									<br />
								</span>
							)}
							{extraMessage?.length > 0 && extraMessage[0]?.length > 0 && (
								<span className="logs__message-text">
									{"Message: " + extraMessage.join("|")}
									<br />
								</span>
							)}
							{lang && <span className="logs__message-text">{"Lang: " + (lang === "*" ? "All" : lang)}</span>}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const Logs = () => {
	const messages = [...useSelector(selectLogMessages)];
	const [openAll, setOpenAll] = useState(false);
	return (
		<ContentPanel>
			<button className="btn btn-outline-info mb-2" onClick={() => setOpenAll(!openAll)}>
				<i className="bi bi-chevron-expand" />
				{openAll ? "Close All" : "Open All"}
			</button>
			<div className="logs">
				{messages.reverse().map((log, id) => (
					<LogMessage key={id} id={id} log={log} collapsed={openAll} />
				))}
			</div>
		</ContentPanel>
	);
};

export default Logs;
