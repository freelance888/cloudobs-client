import { useState } from "react";

import ContentPanel from "../../ContentPanel";
import { pullTiming } from "../../../services/socketApi";

const MediaScheduleTableInitSettings: React.FC = () => {
	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					onClick={() => {
						pullTiming(sheetUrl, worksheetName);
					}}
				>
					<i className="bi bi-cloud-arrow-up" />
					<span>Setup media schedule</span>
				</button>
			}
		>
			<label htmlFor="language" className="form-label">
				Media schedule spreadsheet URL
			</label>
			<div className="input-group mb-3">
				<input className="form-control" value={sheetUrl} onChange={(event) => setSheetUrl(event.target.value)} />
			</div>

			<label htmlFor="language" className="form-label">
				Sheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={worksheetName}
					onChange={(event) => setWorkSheetName(event.target.value)}
				/>
			</div>
		</ContentPanel>
	);
};

export default MediaScheduleTableInitSettings;
