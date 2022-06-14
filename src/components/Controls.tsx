import { useSelector, useDispatch } from "react-redux";
import { cleanup, selectActiveRequest, syncGoogleDrive } from "../store/slices/app";
import StartStopStreamingButton from "./StartStopStreamingButton";

type Props = {
	onSetStreamSettingsClicked: () => void;
	onVideoScheduleClicked: () => void;
	onGoogleDriveSyncClicked: () => void;
};

const Controls = ({ onSetStreamSettingsClicked, onVideoScheduleClicked }: Props) => {
	const dispatch = useDispatch();
	const activeRequest = useSelector(selectActiveRequest);

	return (
		<div className="buttons">
			<div>
				<button className="btn btn-secondary" onClick={onSetStreamSettingsClicked}>
					<i className="bi bi-gear-fill" />
					<span className="ml-2">Stream Settings</span>
				</button>

				<button className="btn btn-outline-primary" onClick={onVideoScheduleClicked}>
					<i className="bi bi-clock" />
					<span className="ml-2">Video schedule</span>
				</button>

				<button
					className="btn btn-info"
					disabled={activeRequest === "postCleanup"}
					onClick={() => dispatch(cleanup() as any)}
				>
					<i className={activeRequest === "postCleanup" ? "bi bi-arrow-clockwise spin" : "bi bi-trash-fill"} />
					<span>Cleanup</span>
				</button>

				<button
					className={"btn btn-outline-info"}
					onClick={() => {
						dispatch(syncGoogleDrive() as any);
					}}
				>
					<i className={"bi bi-arrow-repeat"} />
					<span>Google Drive sync</span>
				</button>
			</div>
			<div className="mt-2">
				<StartStopStreamingButton />
			</div>
		</div>
	);
};

export default Controls;
