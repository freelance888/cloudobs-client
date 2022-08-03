import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanup, initializeV2, selectActiveRequest } from "../store/slices/app";
import ContentPanel from "./ContentPanel";

export const StreamSettings: React.FC = () => {
	const dispatch = useDispatch();
	const activeRequest = useSelector(selectActiveRequest);

	// const languagesSettings = useSelector(selectLanguagesSettings);
	// const [updatedLanguagesSettings, setUpdatedLanguagesSettings] = useState<LanguagesSettings>(languagesSettings);

	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");
	// const languages = useMemo(() => Object.keys(updatedLanguagesSettings), [updatedLanguagesSettings]);

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					disabled={activeRequest === "postInit"}
					onClick={() => dispatch(initializeV2({ sheetUrl, worksheetName }) as any)}
				>
					<i className={activeRequest === "postInit" ? "bi bi-arrow-clockwise spin" : "bi  bi-cloud-arrow-up"} />
					<span>Init</span>
				</button>
			}
			endActions={
				<button
					className="btn btn-info"
					disabled={activeRequest === "postCleanup"}
					onClick={() => dispatch(cleanup() as any)}
				>
					<i className={activeRequest === "postCleanup" ? "bi bi-arrow-clockwise spin" : "bi bi-trash-fill"} />
					<span>Cleanup</span>
				</button>
			}
		>
			<label htmlFor="language" className="form-label">
				Google spreadsheet URL
			</label>
			<div className="input-group mb-3">
				<input className="form-control" value={sheetUrl} onChange={(event) => setSheetUrl(event.target.value)} />
			</div>

			<label htmlFor="language" className="form-label">
				Worksheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={worksheetName}
					onChange={(event) => setWorkSheetName(event.target.value)}
				/>
			</div>

			{/* <ul className="nav nav-tabs">
				{languages.map((language) => (
					<li className="nav-item" key={`tab-lang-${language}`}>
						<div
							className={classNames("nav-link", { active: language === selectedLanguage })}
							aria-current="page"
							onClick={() => {
								// if (!isDefaultPrevented()) {
								setSelectedLanguage(language);
								// }
							}}
						>
							<span className="nav-link-text">{language}</span>

							<button
								className="btn selected-language-delete"
								onClick={(event) => {
									event.preventDefault();

									let newSelectedLanguage =
										languages.filter((languageInList) => languageInList !== language)?.[0] || "";

									setSelectedLanguage(newSelectedLanguage);

									setUpdatedLanguagesSettings(
										produce(updatedLanguagesSettings, (draft) => {
											delete draft[language];
										})
									);
								}}
							>
								&times;
							</button>
						</div>
					</li>
				))}
			</ul> */}

			{/* {languages.map((language) => (
				<div key={language} className={classNames("language-settings-form", { active: language === selectedLanguage })}>
					<div className="row mt-2">
						<div className="col-md-4">
							<label htmlFor={`host-url-${language}`} className="form-label">
								Host URL
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`host-url-${language}`}
									value={updatedLanguagesSettings[language].initial.host_url}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].initial.host_url = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>
						<div className="col-md-4">
							<label htmlFor={`websocket-port-${language}`} className="form-label">
								Websocket port
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`websocket-port-${language}`}
									value={updatedLanguagesSettings[language].initial.websocket_port}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].initial.websocket_port = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>
						<div className="col-md-4">
							<label htmlFor={`password-${language}`} className="form-label">
								Password
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`password-${language}`}
									value={updatedLanguagesSettings[language].initial.password}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].initial.password = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>
					</div>
					<label htmlFor={`original-media-url-${language}`} className="form-label">
						Original media URL
					</label>
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							id={`original-media-url-${language}`}
							value={updatedLanguagesSettings[language].initial.original_media_url}
							onChange={(event) => {
								setUpdatedLanguagesSettings(
									produce(updatedLanguagesSettings, (draft) => {
										draft[language].initial.original_media_url = event.target.value;
									})
								);
							}}
						/>
					</div>

					<div className="row mt-2">
						<h5 className="mt-2">Output settings</h5>

						<div className="col-md-6">
							<label htmlFor={`server-url-${language}`} className="form-label">
								Server URL
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`server-url-${language}`}
									value={updatedLanguagesSettings[language].streamDestination.server}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].streamDestination.server = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<label htmlFor={`stream-key-${language}`} className="form-label">
								Stream Key
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`stream-key-${language}`}
									value={updatedLanguagesSettings[language].streamDestination.key}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].streamDestination.key = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>
					</div>

					<div className="row mt-2">
						<h5 className="mt-2">Google Drive settings</h5>

						<div className="col-md-6">
							<label htmlFor={`folder-id-${language}`} className="form-label">
								Folder ID
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`folder-id-${language}`}
									value={updatedLanguagesSettings[language].gDrive.drive_id}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].gDrive.drive_id = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>

						<div className="col-md-6">
							<label htmlFor={`media-directory-${language}`} className="form-label">
								Media directory
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`media-directory-${language}`}
									value={updatedLanguagesSettings[language].gDrive.media_dir}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].gDrive.media_dir = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>

						<div className="col-md-4">
							<label htmlFor={`api-key-${language}`} className="form-label">
								API key
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`api-key-${language}`}
									value={updatedLanguagesSettings[language].gDrive.api_key}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].gDrive.api_key = event.target.value;
											})
										);
									}}
								/>
							</div>
						</div>

						<div className="col-md-4">
							<label htmlFor={`sync-seconds-${language}`} className="form-label">
								Sync time (seconds)
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`sync-seconds-${language}`}
									value={updatedLanguagesSettings[language].gDrive.sync_seconds}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].gDrive.sync_seconds = Number(event.target.value);
											})
										);
									}}
								/>
							</div>
						</div>

						<div className="col-md-4">
							<label htmlFor={`sync-address-${language}`} className="form-label">
								Sync address
							</label>
							<div className="input-group mb-3">
								<input
									type="text"
									className="form-control"
									id={`sync-address-${language}`}
									value={updatedLanguagesSettings[language].gDrive.gdrive_sync_addr}
									onChange={(event) => {
										setUpdatedLanguagesSettings(
											produce(updatedLanguagesSettings, (draft) => {
												draft[language].gDrive.gdrive_sync_addr = event.target.value;
											})
										);

									}}
								/>
							</div>
						</div>
					</div>
				</div>
			))} */}
		</ContentPanel>
	);
};

export default StreamSettings;
