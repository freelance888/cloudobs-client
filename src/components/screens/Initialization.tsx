import { Fragment, useCallback, useState } from "react";

import ContentPanel from "../ContentPanel";
import { pullConfig } from "../../services/socketApi";

const Initialization: React.FC = () => {
	// TODO remove demo values
	const [sheetUrl, setSheetUrl] = useState(
		"https://docs.google.com/spreadsheets/d/10J2FG-6nKodpXcTVPmNwKGOwGXSxPUWf1MppT7yUgME/edit#gid=2006470615"
	);
	const [sheetName, setSheetName] = useState("table_4");
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
					disabled={useManualConfiguration}
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
					disabled={useManualConfiguration}
					value={sheetName}
					name="sheet_name"
					id="sheet_name"
					onChange={(event) => setSheetName(event.target.value)}
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
							placeholder=""
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