import produce from "immer";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LanguageSettings } from "../services/types";
import { setStreamSettings } from "../store/slices/app";

type Props = {
	language: string;
	languageSettings: LanguageSettings;
};

const EditableStreamDestinationSettings = ({ language, languageSettings }: Props) => {
	const dispatch = useDispatch();

	const [destinationSettingsOpen, setDestinationSettingsOpen] = useState(false);
	const [updatedDestinationSettings, setUpdatedDestinationSettings] = useState(languageSettings.streamDestination);

	const buildStreamUrl: () => string = useCallback(() => {
		const { server, key } = updatedDestinationSettings;

		const serverUrl = server.replace(/\/$/, "");
		const streamKey = key;

		return `${serverUrl}/${streamKey}`;
	}, [updatedDestinationSettings]);

	const saveDestinationSettings = useCallback(() => {
		dispatch(setStreamSettings({ [language]: updatedDestinationSettings }) as any);

		setDestinationSettingsOpen(false);
	}, [dispatch, updatedDestinationSettings, language]);

	const streamUrl = buildStreamUrl();
	const streamUrlEmpty = streamUrl === "/";

	useEffect(() => {
		if (languageSettings.streamParameters.streamActive) {
			setUpdatedDestinationSettings(languageSettings.streamDestination);
			setDestinationSettingsOpen(false);
		}
	}, [languageSettings.streamParameters.streamActive, languageSettings.streamDestination]);

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
							onClickCapture={(event) => {
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
							onClickCapture={(event) => {
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
						<button className="btn btn-outline-primary" type="button" onClickCapture={saveDestinationSettings}>
							Save
						</button>
						<button
							className="btn btn-outline-secondary"
							type="button"
							onClickCapture={() => setDestinationSettingsOpen(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="language-stream-settings-readonly">
					{!streamUrlEmpty && <div className="language-stream-url me-2">{streamUrl}</div>}
					{!languageSettings.streamParameters.streamActive && (
						<button
							className={"btn btn-sm language-stream-url-edit" + (streamUrlEmpty ? " btn-outline-info" : "")}
							onClickCapture={() => setDestinationSettingsOpen(true)}
						>
							{streamUrlEmpty ? "Set destination" : "Edit"}
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default EditableStreamDestinationSettings;
