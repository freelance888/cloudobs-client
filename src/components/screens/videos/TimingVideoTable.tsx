import { useSelector } from "react-redux";

import ContentPanel from "../../ContentPanel";
import { selectRegistry } from "../../../store/slices/registry";
import { playMedia } from "../../../services/socketApi";

import TimingStatusBar from "./TimingStatusBar";
import { convertTimeStampToTime } from "../../../utils/timestamp";

export type DisplayMode = "BLANK" | "NOT_INITIALIZED" | "NOT_PULLED" | "READY";

const TimingVideoTable = () => {
	const registry = useSelector(selectRegistry);
	const timingList = registry.timing_list;

	return (
		<ContentPanel>
			<div className="row sticky-top" style={{ backgroundColor: "white", paddingTop: "5px", paddingBottom: "10px" }}>
				<div className="video-schedule-list-now col">
					<TimingStatusBar />
				</div>
			</div>
			<div className="video-schedule-list col-12 mb-3">
				<div className="container-fluid">
					<div className="stream-settings-video-list-head row mb-1">
						<div className="col-1">Enabled</div>
						<div className="col-5">Media name</div>
						<div className="col-2">Start time</div>
					</div>
					{Object.entries(timingList)
						.sort(([, a], [, b]) => Number(a.timestamp) - Number(b.timestamp))
						.map(([mediaId, item]) => {
							const { name, timestamp, is_enabled, is_played } = item;

							return (
								<div className={`stream-settings-video-list-item row ${is_played ? "played" : ""}`} key={mediaId}>
									<div className="col-1 d-flex align-items-center">
										<input className="form-check-input mt-0" type="checkbox" checked={is_enabled} readOnly />
									</div>
									<div className="col-5">
										<div>{name}</div>
									</div>
									<div className="col-2">
										<div key={`edited-${mediaId}-seconds`}>{convertTimeStampToTime(Number(timestamp))}</div>
									</div>
									<div className="col-4 d-flex justify-content-end">
										<div>
											<button
												className="btn btn-sm btn-success"
												type="button"
												title="Play now"
												onClick={() => {
													const mediaNamePrefix = item.name.split(/^([0-9]+)_.+/)[1];
													playMedia(mediaNamePrefix, true, "check_any");
												}}
											>
												<i className="bi bi-play-fill me-1" />
												Play
											</button>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</ContentPanel>
	);
};

export default TimingVideoTable;
