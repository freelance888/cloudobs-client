import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { initialize, selectActiveRequest } from "../../../store/slices/app";
import ContentPanel from "../../ContentPanel";
import { AppDispatch } from "../../../store/store";

export const VideoTableInitSettings: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const activeRequest = useSelector(selectActiveRequest);

	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					disabled={activeRequest === "postInit"}
					onClick={() => dispatch(initialize({ sheetUrl, worksheetName }))}
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
