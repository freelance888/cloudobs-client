import { Fragment, useCallback, useState } from "react";

import ContentPanel from "../ContentPanel";
import { pullConfig } from "../../services/socketApi";
import { useSelector } from "react-redux";
import { selectRegistry } from "../../store/slices/registry";

const Initialization: React.FC = () => {
	const registry = useSelector(selectRegistry);
	const [sheetUrl, setSheetUrl] = useState(registry.obs_sheet_url ?? "");
	const [sheetName, setSheetName] = useState(registry.obs_sheet_name ?? "");
	const [usersSheetName, setUsersSheetName] = useState(registry.obs_users_sheet_name ?? "");
	const [langs, setLangs] = useState("");
	const [useManualConfiguration, setUseManualConfiguration] = useState(false);
	const [ipLangsString, setIpLangsString] = useState("");

	const [buttonDisabled, setButtonDisabled] = useState(false);

	const prepareIpLangs = useCallback((ipLangsString: string): Record<string, string> => {
		const ipLangs: Record<string, string> = {};

		ipLangsString.split("\n").forEach((line, lineIndex) => {
			if (line.length > 0) {
				const parts = line.trim().split(/\s+/);

				if (parts.length !== 2) {
					throw new Error(`IP Langs field has invalid format.\nLine ${lineIndex + 1}:\n  ${line}`);
				}

				const ip = parts[0];
				const lang = parts[1].toUpperCase();

				ipLangs[ip] = lang;
			}
		});

		return ipLangs;
	}, []);

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					disabled={buttonDisabled || (useManualConfiguration && !ipLangsString)}
					onClick={() => {
						try {
							const ipLangs = useManualConfiguration && ipLangsString ? prepareIpLangs(ipLangsString) : undefined;

							pullConfig({
								sheet_url: sheetUrl,
								sheet_name: sheetName,
								langs: langs ? langs.split(",").map((lang) => lang.trim()) : undefined,
								ip_langs: ipLangs,
								users_sheet_name: usersSheetName,
							});

							setButtonDisabled(true);
						} catch (error) {
							alert(error);
						}
					}}
				>
					<i className="bi bi-cloud-arrow-up" />
					<span>Initialize</span>
				</button>
			}
		>
			<h3>CloudOBS initialization</h3>
			<label htmlFor="sheet_url" className="form-label">
				Sheet URL
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={sheetUrl}
					name="sheet_url"
					id="sheet_url"
					onChange={(event) => setSheetUrl(event.target.value)}
				/>
			</div>

			<label htmlFor="sheet_name" className="form-label">
				Sheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={sheetName}
					name="sheet_name"
					id="sheet_name"
					onChange={(event) => setSheetName(event.target.value)}
				/>
			</div>

			<label htmlFor="sheet_name" className="form-label">
				Users sheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={usersSheetName}
					name="users_sheet_name"
					id="users_sheet_name"
					onChange={(event) => setUsersSheetName(event.target.value)}
				/>
			</div>

			<label htmlFor="langs" className="form-label">
				Langs (optional)
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={langs}
					name="langs"
					id="langs"
					placeholder="Format: ENG, RUS, SPA"
					onChange={(event) => setLangs(event.target.value)}
				/>
			</div>

			<div className="form-check mb-3">
				<input
					id="use-manual-configuration"
					className="form-check-input"
					type="checkbox"
					checked={useManualConfiguration}
					onChange={() => {
						setUseManualConfiguration(!useManualConfiguration);
					}}
				/>
				<label htmlFor="use-manual-configuration" className="form-label">
					Use manual configuration
				</label>
			</div>

			{useManualConfiguration && (
				<Fragment>
					<label htmlFor="ip_langs" className="form-label">
						IP Langs
					</label>
					<div className="input-group mb-3">
						<textarea
							className="form-control"
							value={ipLangsString}
							name="ip_langs"
							id="ip_langs"
							placeholder={"Format:\n192.168.1.1 ENG\n192.168.1.2 RUS\n192.168.1.3 CES"}
							rows={4}
							onChange={(event) => setIpLangsString(event.target.value)}
						/>
					</div>
				</Fragment>
			)}
		</ContentPanel>
	);
};

export default Initialization;
