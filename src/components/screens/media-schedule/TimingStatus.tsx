import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimingStatus, selectMediaScheduleStatus } from "../../../store/slices/media-schedule";
import { convertTimeStampToTime } from "../../../utils/timestamp";

const TimingStatus = () => {
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

			const now = new Date();
			const timingStartTime = new Date(timestamp);

			const millisFromStart = now.getTime() - timingStartTime.getTime();

			setCurrentTimeMillis(millisFromStart);

			intervalTicker.current = setInterval(() => {
				setCurrentTimeMillis((prevTimeMillis) => prevTimeMillis + 1000);
			}, 1000);
		}
	}, [running, timestamp]);

	return (
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
	);
};

export default TimingStatus;
