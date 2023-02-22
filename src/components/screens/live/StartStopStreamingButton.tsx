import { useMemo } from "react";

import { useSelector } from "react-redux";

import { startStreaming, stopStreaming } from "../../../services/socketApi";
import { selectRegistry } from "../../../store/slices/registry";

const StartStopStreamingButton = () => {
	const registry = useSelector(selectRegistry);

	const streamsActive = useMemo(() => {
		return Object.values(registry.minion_configs).some(({ stream_on }) => stream_on.value);
	}, [registry.minion_configs]);

	const languagesCount = useMemo(() => {
		return Object.keys(registry.minion_configs).length;
	}, [registry.minion_configs]);

	return (
		<button
			className={streamsActive ? "btn btn-danger" : "btn btn-success"}
			title={(streamsActive ? "Stop" : "Start") + " streaming of all languages"}
			onClick={() => {
				if (streamsActive) {
					if (window.confirm("❗️ Stop all streams?") === true) {
						stopStreaming();
					}
				} else {
					startStreaming();
				}
			}}
		>
			<i className="bi bi-broadcast" />
			<span>
				{streamsActive ? "Stop" : "Start"} streaming ({languagesCount} langs)
			</span>
		</button>
	);
};

export default StartStopStreamingButton;
