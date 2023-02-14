import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import ContentPanel from "../../ContentPanel";
import MediaScheduleTableInitSettings from "../initialization/MediaScheduleTableInitSettings";
import { selectRegistry } from "../../../store/slices/app";
import { playMedia, pullTiming } from "../../../services/socketApi";

import TimingStatus from "./TimingStatus";

export type DisplayMode = "BLANK" | "NOT_INITIALIZED" | "NOT_PULLED" | "READY";

const MediaScheduleSettings = () => {
	const [displayMode, setDisplayMode] = useState<DisplayMode>("BLANK");
	const registry = useSelector(selectRegistry);

	const timingList = registry.timing_list;

	useEffect(() => {
		(async () => {
			pullTiming(registry.timing_sheet_url || "", registry.timing_sheet_name || ""); // clarify params

			// const res = await ApiService.getMediaSchedule(); // pulled config before

			// let interval: ReturnType<typeof setInterval> | null = null;

			// if (res.status === "error") {
			// 	if (res.message === "Please complete Timing Google Sheets initialization first") {
			// 		setDisplayMode("NOT_INITIALIZED");
			// 	} else if (res.message === "Please pull Timing Google Sheets first") {
			// 		setDisplayMode("NOT_PULLED");
			// 	}
			// } else {
			// 	setDisplayMode("READY");
			// await dispatch(fetchMediaSchedule());
			// dispatch(fetchTimingStatus());
			//get from registry
			// }
		})();
	}, []);

	if (displayMode === "BLANK") {
		return <ContentPanel>Loading...</ContentPanel>;
	}

	if (displayMode === "NOT_INITIALIZED") {
		return (
			<ContentPanel>
				<MediaScheduleTableInitSettings />
			</ContentPanel>
		);
	} else if (displayMode === "NOT_PULLED") {
		return (
			<ContentPanel>
				<button
					className="btn btn-sm btn-primary"
					onClick={() => {
						//dispatch(pullMediaSchedule());Todo clarify logic
					}}
				>
					Pull media schedule
				</button>
			</ContentPanel>
		);
	}

	return (
		<ContentPanel>
			<div className="row sticky-top" style={{ backgroundColor: "white", paddingTop: "5px", paddingBottom: "10px" }}>
				<div className="video-schedule-list-now col">
					<div>
						<TimingStatus onDisplayModeChanged={setDisplayMode} />
					</div>
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
										<input className="form-check-input mt-0" type="checkbox" checked={is_enabled} />
									</div>
									<div className="col-5">
										<div>{name}</div>
									</div>
									<div className="col-2">
										<div key={`edited-${mediaId}-seconds`}>
											{/* <input
												type="number"
												className="form-control stream-settings-video-list-item-input"
												value={timestamp}
												onChange={(event) => {
													setEditedMediaSchedule({
														...editedMediaSchedule,
														[mediaId]: {
															...editedMediaSchedule[mediaId],
															timestamp: event.target.value,
														},
													});
												}}
											/> */}
											{timestamp}
										</div>
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

export default MediaScheduleSettings;
