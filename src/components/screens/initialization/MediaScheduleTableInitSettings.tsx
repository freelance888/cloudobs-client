import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { selectActiveRequest } from "../../../store/slices/app";
import { setupMediaSchedule } from "../../../store/slices/media-schedule";
import ContentPanel from "../../ContentPanel";
import { AppDispatch } from "../../../store/store";

const MediaScheduleTableInitSettings: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const activeRequest = useSelector(selectActiveRequest);

	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");

	return (
		<ContentPanel
			mainActions={
				<button className="btn btn-primary" onClick={() => dispatch(setupMediaSchedule({ sheetUrl, worksheetName }))}>
					<i className={activeRequest === "postInit" ? "bi bi-arrow-clockwise spin" : "bi bi-cloud-arrow-up"} />
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
