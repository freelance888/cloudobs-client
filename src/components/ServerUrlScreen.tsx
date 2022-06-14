import produce from "immer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildUrl } from "../services/utils";
import {
	fetchLanguagesSettings,
	selectServerUrl,
	ServerUrl,
	ServerUrlProtocol,
	updateServerUrl,
} from "../store/slices/app";

export const LS_KEY_SERVER_IP = "cloudobs_server_ip";
export const LS_KEY_RECENT_URLS = "cloudobs_recent_server_urls";

const MAX_RECENT_URLS = 10;
const RECENT_SERVER_URLS_JSON = localStorage.getItem(LS_KEY_RECENT_URLS) ?? "[]";

const storeRecentUrl = (url: ServerUrl): void => {
	const recentUrlsJson = localStorage.getItem(LS_KEY_RECENT_URLS) ?? "[]";
	const recentUrls: ServerUrl[] = JSON.parse(recentUrlsJson);

	const filteredRecentUrls = recentUrls.filter((recentUrl) => {
		return !(
			recentUrl.protocol === url.protocol &&
			recentUrl.ipAddress === url.ipAddress &&
			recentUrl.port === url.port
		);
	});

	if (filteredRecentUrls.length < MAX_RECENT_URLS) {
		localStorage.setItem(LS_KEY_RECENT_URLS, JSON.stringify([url, ...filteredRecentUrls]));
	} else {
		localStorage.setItem(LS_KEY_RECENT_URLS, JSON.stringify([url, ...filteredRecentUrls.slice(0, -1)]));
	}
};

type Props = {
	onUrlSet: () => void;
};

const ServerUrlScreen: React.FC<Props> = ({ onUrlSet }: Props) => {
	const dispatch = useDispatch();
	const serverUrl = useSelector(selectServerUrl);
	const [editedServerUrl, setEditedServerUrl] = useState(serverUrl);
	const [selectedRecentUrl, setSelectedRecentUrl] = useState<number>(-1);

	const [recentServerUrls] = useState<ServerUrl[]>(JSON.parse(RECENT_SERVER_URLS_JSON));

	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

	return (
		<div className="server-url-screen">
			<div className="server-url-screen-content">
				<label htmlFor="server-url" className="form-label">
					Enter Server URL
				</label>

				<div className="row">
					<div className="server-url input-group mb-3 col-6">
						{showAdvancedSettings ? (
							<select
								className="server-url-protocol form-select"
								defaultValue={serverUrl.protocol}
								onChange={(event) => {
									setEditedServerUrl(
										produce(editedServerUrl, (draft) => {
											draft.protocol = event.target.value as ServerUrlProtocol;
										})
									);
								}}
							>
								<option value="http">http://</option>
								<option value="https">https://</option>
							</select>
						) : (
							<span className="server-url-protocol input-group-text">{editedServerUrl.protocol}://</span>
						)}
						<input
							type="text"
							autoFocus={true}
							className="form-control"
							id="server-url"
							placeholder="IP address..."
							value={editedServerUrl.ipAddress}
							onChange={(event) => {
								setEditedServerUrl(
									produce(editedServerUrl, (draft) => {
										draft.ipAddress = event.target.value;
									})
								);
							}}
						/>
						{showAdvancedSettings ? (
							<input
								type="number"
								className="server-url-port form-control"
								value={editedServerUrl.port}
								onChange={(event) => {
									setEditedServerUrl(
										produce(editedServerUrl, (draft) => {
											draft.port = Number(event.target.value);
										})
									);
								}}
							/>
						) : (
							<span className="server-url-port input-group-text">:{editedServerUrl.port}</span>
						)}
						<button
							className="btn btn-info"
							type="button"
							onClick={async () => {
								dispatch(updateServerUrl(editedServerUrl));
								await dispatch(fetchLanguagesSettings() as any);

								storeRecentUrl(editedServerUrl);

								onUrlSet();
							}}
						>
							Enter
						</button>
					</div>

					<label htmlFor="language" className="form-label">
						Or choose recent:
					</label>
					<div className="input-group mb-3">
						<select
							className="form-select"
							id="language"
							value={selectedRecentUrl}
							onChange={(event) => setSelectedRecentUrl(Number(event.target.value))}
						>
							<option value={""} />
							{recentServerUrls.map((url, index) => {
								const urlString = buildUrl(url);
								return (
									<option value={index} key={urlString}>
										{urlString}
									</option>
								);
							})}
						</select>
						<button
							className="btn btn-outline-info"
							type="button"
							onClick={async () => {
								const recentUrl = recentServerUrls[selectedRecentUrl];
								dispatch(updateServerUrl(recentUrl));
								await dispatch(fetchLanguagesSettings() as any);

								storeRecentUrl(editedServerUrl);

								onUrlSet();
							}}
						>
							Select
						</button>
					</div>
				</div>

				<div className="form-check show-advanced-settings">
					<input
						className="form-check-input"
						type="checkbox"
						id="show-advanced-settings"
						checked={showAdvancedSettings}
						onChange={() => setShowAdvancedSettings(!showAdvancedSettings)}
					/>
					<label className="form-check-label" htmlFor="show-advanced-settings">
						Advanced settings
					</label>
				</div>
			</div>
		</div>
	);
};

export default ServerUrlScreen;
