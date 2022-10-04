import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialize, selectActiveRequest } from "../../../store/slices/app";
import ContentPanel from "../../ContentPanel";

export const VideoTableInitSettings: React.FC = () => {
	const dispatch = useDispatch();
	const activeRequest = useSelector(selectActiveRequest);

	const [sheetUrl, setSheetUrl] = useState("");
	const [worksheetName, setWorkSheetName] = useState("");

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					disabled={activeRequest === "postInit"}
					onClick={() => dispatch(initialize({ sheetUrl, worksheetName }) as any)}
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
		</ContentPanel>
	);
};

export default VideoTableInitSettings;