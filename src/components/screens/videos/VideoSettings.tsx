import { useSelector } from "react-redux";

import { Registry } from "../../../services/types";
import { selectRegistry } from "../../../store/slices/app";

import TimingVideoTable from "./TimingVideoTable";
import TimingInitializationForm from "./TimingInitializationForm";

const VideoSettings = () => {
	const registry: Registry = useSelector(selectRegistry);

	const { timing_sheet_url, timing_sheet_name } = registry;

	const timingNotInitialized = !timing_sheet_url || !timing_sheet_name;

	return (
		<div>
			{timingNotInitialized && <TimingInitializationForm />}
			<TimingVideoTable />
		</div>
	);
};

export default VideoSettings;
