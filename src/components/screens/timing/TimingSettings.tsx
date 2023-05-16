import { useSelector } from "react-redux";

import { selectRegistry } from "../../../store/slices/registry";

import TimingVideoTable from "./TimingVideoTable";
import TimingInitializationForm from "./TimingInitializationForm";

const TimingSettings: React.FC = () => {
	const registry = useSelector(selectRegistry);

	const { timing_sheet_url, timing_sheet_name, timing_list } = registry;

	const timingNotInitialized = !timing_sheet_url || !timing_sheet_name || timing_list.length === 0;

	return <div className="m-auto">{timingNotInitialized ? <TimingInitializationForm /> : <TimingVideoTable />}</div>;
};

export default TimingSettings;
