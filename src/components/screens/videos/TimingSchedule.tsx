import { useState } from "react";
import TimePicker from "react-time-picker";

import { runTiming } from "../../../services/socketApi";

enum ScheduleType {
	Countdown = "countdown",
	Daytime = "daytime",
}

type Props = {
	onClose: () => void;
};

const TimingSchedule: React.FC<Props> = ({ onClose }: Props) => {
	const [scheduleType, setScheduleType] = useState<ScheduleType | null>(null);
	const [time, setTime] = useState("00:00:00");

	return (
		<div className="mt-2 mb-3">
			<div className="timing-schedule-content">
				<div className="timing-schedule-select">
					<ScheduleTypeOption
						option={ScheduleType.Countdown}
						label="Countdown"
						selected={scheduleType === ScheduleType.Countdown}
						onSelected={setScheduleType}
					/>
					<ScheduleTypeOption
						option={ScheduleType.Daytime}
						label="Daytime (GMT+2)"
						selected={scheduleType === ScheduleType.Daytime}
						onSelected={setScheduleType}
					/>
				</div>
				{scheduleType !== null && (
					<div className="timing-schedule-input">
						<label className="form-label">
							{scheduleType === ScheduleType.Countdown ? "Countdown:" : "Daytime (GMT+2):"}
						</label>
						<div className="input-group mb-2">
							<TimePicker
								className="form-control"
								onChange={(value) => {
									setTime(value || "00:00:00");
								}}
								value={time}
								format="HH:mm:ss"
								maxDetail="second"
								disableClock={true}
								clearIcon={null}
							/>
						</div>
					</div>
				)}
			</div>
			<button
				className="btn btn-sm btn-primary"
				disabled={scheduleType === null}
				onClick={() => {
					if (scheduleType === ScheduleType.Countdown) {
						runTiming(time, undefined);
					} else {
						runTiming(undefined, time);
					}
					// TODO show status message that timing was scheduled
					onClose();
				}}
			>
				Schedule
			</button>
			<button className="btn btn-sm btn-secondary ms-1" onClick={onClose}>
				Cancel
			</button>
		</div>
	);
};

type ScheduleTypeOptionProps = {
	option: ScheduleType;
	label: string;
	selected: boolean;
	onSelected: (selected: ScheduleType) => void;
};

const ScheduleTypeOption: React.FC<ScheduleTypeOptionProps> = (props: ScheduleTypeOptionProps) => {
	return (
		<div className="form-check">
			<input
				className="form-check-input"
				type="radio"
				name={props.option}
				id={props.option}
				checked={props.selected}
				onChange={(event) => {
					props.onSelected(event.target.name as ScheduleType);
				}}
			/>
			<label className="form-check-label" htmlFor={props.option}>
				{props.label}
			</label>
		</div>
	);
};

export default TimingSchedule;
