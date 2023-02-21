import { useState } from "react";
import { runTiming } from "../../../services/socketApi";

type Props = {
	onClose: () => void;
};

const TimingSchedule: React.FC<Props> = ({ onClose }: Props) => {
	const [countdown, setCountdown] = useState("");
	const [daytime, setDaytime] = useState("");

	return (
		<div className="mt-1 mb-4">
			<div className="row g-3">
				<div className="col-4">
					<label htmlFor="countdown" className="form-label">
						Countdown
					</label>
					<div className="input-group mb-3">
						<input
							className="form-control"
							value={countdown}
							name="countdown"
							id="countdown"
							placeholder="Format: %H:%M:%S"
							onChange={(event) => setCountdown(event.target.value)}
						/>
					</div>
				</div>
				<div className="col-4">
					<label htmlFor="daytime" className="form-label">
						Daytime
					</label>
					<div className="input-group mb-3">
						<input
							className="form-control"
							value={daytime}
							name="daytime"
							id="daytime"
							placeholder="Format: %H:%M:%S"
							onChange={(event) => setDaytime(event.target.value)}
						/>
					</div>
				</div>
			</div>
			<button
				className="btn btn-sm btn-primary"
				onClick={() => {
					runTiming(countdown, daytime);
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

export default TimingSchedule;
