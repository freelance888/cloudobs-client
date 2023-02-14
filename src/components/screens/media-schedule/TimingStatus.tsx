import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import classNames from "classnames";

import { convertTimeStampToTime } from "../../../utils/timestamp";
import StopMediaButton from "../../StopMediaButton";
import { removeTiming, stopTiming } from "../../../services/socketApi";
import { selectRegistry } from "../../../store/slices/app";

import { DisplayMode } from "./MediaScheduleSettings";

type Props = {
	onDisplayModeChanged: (displayMode: DisplayMode) => void;
};

const TimingStatus = ({ onDisplayModeChanged }: Props) => {
	const intervalTicker = useRef<ReturnType<typeof setInterval>>();
	const registry = useSelector(selectRegistry);

	const running = registry.timing_start_time !== null;
	const timestamp = registry.timing_start_time;

	const classes = running ? "timing-status--running" : "timing-status--inactive";
	const text = running ? "RUNNING" : "INACTIVE";

	const [currentTimeMillis, setCurrentTimeMillis] = useState(0);

	useEffect(() => {
		if (running) {
			intervalTicker.current && clearInterval(intervalTicker.current);

			const timestampZero = `${timestamp}Z`;

			const now = new Date();
			const timingStartTime = new Date(timestampZero);

			const millisFromStart = now.getTime() - timingStartTime.getTime();

			setCurrentTimeMillis(millisFromStart);

			intervalTicker.current = setInterval(() => {
				setCurrentTimeMillis((prevTimeMillis) => prevTimeMillis + 1000);
			}, 1000);
		}
	}, [running, timestamp]);

	return (
		<div className="d-flex justify-content-between">
			<div>
				<span>Timing:&nbsp;</span>
				<span className={classNames("timing-status", classes)}>{text}</span>
				{running && (
					<span className="ms-3">
						Current time: <b>{convertTimeStampToTime(currentTimeMillis, true)}</b>
					</span>
				)}
				<button
					className="btn btn-sm btn-secondary ms-3"
					onClick={() => {
						if (window.confirm("❗️ Stop the timing?")) {
							stopTiming();
						}
					}}
				>
					Stop timing
				</button>
			</div>
			<div className="d-flex">
				<StopMediaButton class="ms-3 btn-sm" />
				<button
					className="btn btn-sm btn-danger ms-3"
					onClick={() => {
						if (window.confirm("Timing will be deleted. Are you sure?")) {
							removeTiming();
							onDisplayModeChanged("NOT_INITIALIZED");
						}
					}}
				>
					Delete timing
				</button>
			</div>
		</div>
	);
};

export default TimingStatus;
