import { useState } from "react";

import { useSelector } from "react-redux";

import { selectActiveRequest } from "../../../store/slices/app";
import ContentPanel from "../../ContentPanel";
import { pullConfig } from "../../../services/soketApi";

const VideoTableInitSettings: React.FC = () => {
	const activeRequest = useSelector(selectActiveRequest);
	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					disabled={activeRequest === "postInit"}
					onClick={() => pullConfig(sheetUrl, worksheetName)}
				>
					<i className={activeRequest === "postInit" ? "bi bi-arrow-clockwise spin" : "bi bi-cloud-arrow-up"} />
					<span>Init</span>
				</button>
			}
		>
			<h3>Initialization</h3>
			<label htmlFor="language" className="form-label">
				Google spreadsheet URL
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={sheetUrl}
					name="sheet_url"
					onChange={(event) => setSheetUrl(event.target.value)}
				/>
			</div>

			<label htmlFor="language" className="form-label">
				Worksheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={worksheetName}
					name="worksheet_name"
					onChange={(event) => setWorkSheetName(event.target.value)}
				/>
			</div>
		</ContentPanel>
	);
};

export default VideoTableInitSettings;
