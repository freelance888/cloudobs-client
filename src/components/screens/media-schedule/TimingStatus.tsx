import { useEffect, useRef, useState } from "react";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import {
	deleteTiming,
	fetchTimingStatus,
	pullMediaSchedule,
	resetMediaSchedule,
	selectMediaScheduleStatus,
} from "../../../store/slices/media-schedule";
import { convertTimeStampToTime } from "../../../utils/timestamp";
import { AppDispatch } from "../../../store/store";
import StopMediaButton from "../../StopMediaButton";

import { DisplayMode } from "./MediaScheduleSettings";

type Props = {
	onDisplayModeChanged: (displayMode: DisplayMode) => void;
};

const TimingStatus = ({ onDisplayModeChanged }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const intervalTicker = useRef<ReturnType<typeof setInterval>>();
	const mediaScheduleStatus = useSelector(selectMediaScheduleStatus);
	const { running, timestamp } = mediaScheduleStatus;

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
				<span>Schedule:&nbsp;</span>
				<span className={classNames("timing-status", classes)}>{text}</span>
				{mediaScheduleStatus.running && (
					<span className="ms-3">
						Current time: <b>{convertTimeStampToTime(currentTimeMillis, true)}</b>
					</span>
				)}
				<button
					className="btn btn-sm btn-info ms-3"
					onClick={() => {
						dispatch(fetchTimingStatus());
					}}
				>
					Refresh
				</button>
				<button
					className="btn btn-sm btn-secondary ms-3"
					onClick={async () => {
						if (window.confirm("❗️ Stop the timing?") === true) {
							await dispatch(resetMediaSchedule());
							dispatch(fetchTimingStatus());
						}
					}}
				>
					Stop timing
				</button>
			</div>
			<div className="d-flex">
				<button
					className="btn btn-sm btn-secondary ms-3"
					title="Update server data and fetch current spreadsheet state to app UI"
					onClick={() => {
						dispatch(pullMediaSchedule());
					}}
				>
					Pull & refresh
				</button>
				<StopMediaButton class="ms-3 btn-sm" />
				<button
					className="btn btn-sm btn-danger ms-3"
					onClick={async () => {
						if (window.confirm("Timing will be deleted. Are you sure?") === true) {
							await dispatch(deleteTiming());
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
