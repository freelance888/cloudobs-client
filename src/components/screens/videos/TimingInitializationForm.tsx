import { useState } from "react";

import ContentPanel from "../../ContentPanel";
import { pullTiming } from "../../../services/socketApi";
import { useSelector } from "react-redux";
import { selectRegistry } from "../../../store/slices/registry";

const TimingInitializationForm: React.FC = () => {
	const registry = useSelector(selectRegistry);
	const [sheetUrl, setSheetUrl] = useState(registry.timing_sheet_url ?? "");
	const [sheetName, setSheetName] = useState(registry.timing_sheet_name ?? "");

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					onClick={() => {
						pullTiming(sheetUrl, sheetName);
					}}
				>
					<i className="bi bi-cloud-arrow-up" />
					<span>Pull timing</span>
				</button>
			}
		>
			<label htmlFor="timing_sheet_url" className="form-label">
				Timing spreadsheet URL
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={sheetUrl}
					id="timing_sheet_url"
					onChange={(event) => setSheetUrl(event.target.value)}
				/>
			</div>

			<label htmlFor="timing_sheet_name" className="form-label">
				Sheet name
			</label>
			<div className="input-group mb-3">
				<input
					className="form-control"
					value={sheetName}
					id="timing_sheet_name"
					onChange={(event) => setSheetName(event.target.value)}
				/>
			</div>
		</ContentPanel>
	);
};

export default TimingInitializationForm;
