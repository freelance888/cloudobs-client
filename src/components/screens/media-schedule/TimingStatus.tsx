import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTiming, fetchTimingStatus, selectMediaScheduleStatus } from "../../../store/slices/media-schedule";
import { convertTimeStampToTime } from "../../../utils/timestamp";
import { DisplayMode } from "./MediaScheduleSettings";

type Props = {
	onDisplayModeChanged: (displayMode: DisplayMode) => void;
};

const TimingStatus = ({ onDisplayModeChanged }: Props) => {
	const dispatch = useDispatch();
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
		<div className="d-flex">
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
						dispatch(fetchTimingStatus() as any);
					}}
				>
					Refresh
				</button>
			</div>
			<button
				className="btn btn-sm btn-danger ms-auto"
				onClick={async () => {
					if (window.confirm("Timing will be deleted. Are you sure?") === true) {
						await dispatch(deleteTiming() as any);
						onDisplayModeChanged("NOT_INITIALIZED");
					}
				}}
			>
				Delete timing
			</button>
		</div>
	);
};

export default TimingStatus;
