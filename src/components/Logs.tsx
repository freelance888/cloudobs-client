import { useSelector } from "react-redux";
import { selectLogMessages } from "../store/slices/logs";
import ContentPanel from "./ContentPanel";

const Logs: React.FC = () => {
	const messages = useSelector(selectLogMessages);

	return (
		<ContentPanel>
			<div className="logs">
				{messages.map((message) => {
					const { id, text, timestamp, severity } = message;

					let prefix = "";
					switch (severity) {
						case "success":
							prefix = "✅";
							break;
						case "error":
							prefix = "❌";
							break;
						case "warn":
							prefix = "⚠️";
							break;
					}

					return (
						<div className="logs__message" key={id}>
							<span className="logs__message-timestamp me-2">
								[{timestamp}]<span className="logs_message-prefix ms-1">{prefix}</span>:
							</span>
							<span className="logs__message-text">{text}</span>
						</div>
					);
				})}
			</div>
		</ContentPanel>
	);
};

export default Logs;
