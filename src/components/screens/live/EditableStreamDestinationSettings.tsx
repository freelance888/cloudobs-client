import { useCallback, useEffect, useState } from "react";

import { produce } from "immer";
import { useDispatch } from "react-redux";

import useLogger from "../../../hooks/useLogger";
import { MinionConfig } from "../../../services/types";
import { AppDispatch } from "../../../store/store";
import { setStreamSettings } from "../../../services/socketApi";

type Props = {
	language: string;
	languageSettings: MinionConfig;
};

const EditableStreamDestinationSettings = ({ language, languageSettings }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const { logSuccess, logError } = useLogger();

	const [destinationSettingsOpen, setDestinationSettingsOpen] = useState(false);
	const [updatedDestinationSettings, setUpdatedDestinationSettings] = useState(languageSettings.stream_settings);

	const buildStreamUrl: () => string = useCallback(() => {
		const { server, key } = updatedDestinationSettings;

		const serverUrl = server.replace(/\/$/, "");
		const streamKey = key;

		return `${serverUrl}/${streamKey}`;
	}, [updatedDestinationSettings]);

	const saveDestinationSettings = useCallback(() => {
		setStreamSettings(updatedDestinationSettings.server, updatedDestinationSettings.key, language);

		setDestinationSettingsOpen(false);
	}, [dispatch, updatedDestinationSettings, language]);

	const streamUrl = buildStreamUrl();
	const streamUrlEmpty = streamUrl === "/";

	useEffect(() => {
		if (languageSettings.stream_on) {
			setUpdatedDestinationSettings(languageSettings.stream_settings);
			setDestinationSettingsOpen(false);
		}
	}, [languageSettings.stream_on, languageSettings.stream_settings]);

	return (
		<div className="language-stream-settings">
			{destinationSettingsOpen ? (
				<div className="col">
					<div className="input-group input-group-sm">
						<input
							type="text"
							className="form-control"
							placeholder="Server URL"
							autoFocus={true}
							value={updatedDestinationSettings.server}
							onClick={(event) => {
								event.stopPropagation();
							}}
							onChange={(event) => {
								setUpdatedDestinationSettings(
									produce(updatedDestinationSettings, (draft) => {
										draft.server = event.target.value;
									})
								);
							}}
							onKeyDown={({ code }) => {
								if (code === "Enter") {
									saveDestinationSettings();
								} else if (code === "Escape") {
									setDestinationSettingsOpen(false);
								}
							}}
						/>
						<input
							type="text"
							className="form-control"
							placeholder="Stream Key"
							value={updatedDestinationSettings.key}
							onClick={(event) => {
								event.stopPropagation();
							}}
							onChange={(event) => {
								setUpdatedDestinationSettings(
									produce(updatedDestinationSettings, (draft) => {
										draft.key = event.target.value;
									})
								);
							}}
							onKeyDown={({ code }) => {
								if (code === "Enter") {
									saveDestinationSettings();
								} else if (code === "Escape") {
									setDestinationSettingsOpen(false);
								}
							}}
						/>
						<button className="btn btn-outline-primary" type="button" onClick={saveDestinationSettings}>
							Save
						</button>
						<button
							className="btn btn-outline-secondary"
							type="button"
							onClick={() => setDestinationSettingsOpen(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="language-stream-settings-readonly">
					{!streamUrlEmpty && (
						<>
							<i className="bi bi-arrow-right"></i>
							<div className="language-stream-url me-2">{streamUrl}</div>
						</>
					)}
					{!languageSettings.stream_on && (
						<>
							{!streamUrlEmpty && (
								<button
									className={"btn btn-sm language-stream-url-edit" + (streamUrlEmpty ? " btn-outline-info" : "")}
									onClick={async () => {
										try {
											await navigator.clipboard.writeText(streamUrl);
											logSuccess(`RTMP URL '${streamUrl}' copied to clipboard`);
										} catch (error) {
											logError(`RTMP URL '${streamUrl}' copying to clipboard failed`);
										}
									}}
								>
									Copy
								</button>
							)}
							<button
								className={"btn btn-sm language-stream-url-edit" + (streamUrlEmpty ? " btn-outline-info" : "")}
								onClick={() => setDestinationSettingsOpen(true)}
							>
								{streamUrlEmpty ? "Set destination" : "Edit"}
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default EditableStreamDestinationSettings;
