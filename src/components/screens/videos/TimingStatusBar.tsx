import { Fragment, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import classNames from "classnames";

import { convertTimeStampToTime } from "../../../utils/timestamp";
import { selectRegistry } from "../../../store/slices/registry";
import { pullTiming, removeTiming, runTiming, stopTiming } from "../../../services/socketApi";
import StopMediaButton from "../../StopMediaButton";

import TimingSchedule from "./TimingSchedule";

const TimingStatusBar = () => {
	const intervalTicker = useRef<ReturnType<typeof setInterval>>();
	const registry = useSelector(selectRegistry);

	const running = registry.timing_start_time !== null;
	const timestamp = registry.timing_start_time;
	const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Kyiv" }));
	const scheduled = now.getTime() - new Date(`${timestamp}`).getTime() < 0;

	const classes = scheduled
		? "timing-status--scheduled"
		: running
		? "timing-status--running"
		: "timing-status--inactive";
	const text = scheduled ? "SCHEDULED" : running ? "RUNNING" : "INACTIVE";

	const [currentTimeMillis, setCurrentTimeMillis] = useState(0);
	const [scheduleOpen, setScheduleOpen] = useState(false);

	useEffect(() => {
		intervalTicker.current && clearInterval(intervalTicker.current);
		intervalTicker.current = setInterval(() => {
			setCurrentTimeMillis((prevTimeMillis) => prevTimeMillis + 1000);
		}, 1000);

		if (running) {
			const timingStartTime = new Date(`${timestamp}`);
			const millisFromStart = now.getTime() - timingStartTime.getTime();

			setCurrentTimeMillis(millisFromStart);
		}
		return () => {
			intervalTicker.current && clearInterval(intervalTicker.current);
		};
	}, [running, timestamp]);

	return (
		<div className="timing-status-bar">
			<div className="d-flex justify-content-between">
				<div>
					<span>Timing:&nbsp;</span>
					<span className={classNames("timing-status", classes)}>{text}</span>
					{running ? (
						<Fragment>
							<span className="ms-3">
								{scheduled ? "Time to start: " : "Time from start: "}
								<b>{convertTimeStampToTime(Math.abs(currentTimeMillis), true)}</b>
							</span>

							<button
								className="btn btn-sm btn-primary ms-3"
								onClick={() => {
									if (window.confirm("❗️ Stop the timing?")) {
										stopTiming();
									}
								}}
							>
								Stop timing
							</button>
						</Fragment>
					) : (
						<Fragment>
							<button
								className="btn btn-sm btn-primary ms-3"
								onClick={() => {
									runTiming();
								}}
							>
								Start now
							</button>
							<button
								className="btn btn-sm btn-secondary ms-1"
								disabled={scheduleOpen}
								onClick={() => {
									setScheduleOpen(true);
								}}
							>
								Schedule start
							</button>
						</Fragment>
					)}
					<span className="ms-3">
						Current time (GMT+2): <b>{now.toLocaleString("en-GB").substring(11, 20)}</b>
					</span>
				</div>
				<div className="d-flex">
					<button
						className="btn btn-info"
						title="Pull actual timing from Google spreadsheet"
						onClick={() => pullTiming()}
					>
						Refresh
					</button>
					<StopMediaButton class="ms-2 btn-sm" />
					<button
						className="btn btn-sm btn-danger ms-2"
						title="Delete timing and stop played video."
						onClick={() => {
							if (window.confirm("Remove timing and stop video?")) {
								removeTiming();
							}
						}}
					>
						Delete timing
					</button>
				</div>
			</div>
			{scheduleOpen && <TimingSchedule onClose={() => setScheduleOpen(false)} />}
		</div>
	);
};

export default TimingStatusBar;
