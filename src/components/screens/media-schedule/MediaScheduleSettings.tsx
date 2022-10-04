import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MediaSchedule } from "../../../services/types";
import * as ApiService from "../../../services/api/index";
import {
	fetchMediaSchedule,
	playMedia,
	pullMediaSchedule,
	resetMediaSchedule,
	selectMediaSchedule,
	// setMediaSchedule,
	// stopMedia,
	updateMedia,
} from "../../../store/slices/media-schedule";
import ContentPanel from "../../ContentPanel";
import MediaScheduleTableInitSettings from "../initialization/MediaScheduleTableInitSettings";

type DisplayMode = "BLANK" | "NOT_INITIALIZED" | "NOT_PULLED" | "READY";

export const MediaScheduleSettings = () => {
	const dispatch = useDispatch();
	const [displayMode, setDisplayMode] = useState<DisplayMode>("BLANK");

	const mediaSchedule = useSelector(selectMediaSchedule);

	const [editedMediaSchedule, setEditedMediaSchedule] = useState<MediaSchedule>({});

	useEffect(() => {
		setEditedMediaSchedule(mediaSchedule);
	}, [mediaSchedule]);

	useEffect(() => {
		const fn = async () => {
			const res = await ApiService.getMediaSchedule();

			if (res.status === "error") {
				if (res.message === "Please complete Timing Google Sheets initialization first") {
					setDisplayMode("NOT_INITIALIZED");
				} else if (res.message === "Please pull Timing Google Sheets first") {
					setDisplayMode("NOT_PULLED");
				}
			} else {
				setDisplayMode("READY");
			}
		};

		fn();
	}, []);

	useEffect(() => {
		if (displayMode === "READY") {
			dispatch(fetchMediaSchedule() as any);
		}
	}, [dispatch, displayMode]);

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
						dispatch(pullMediaSchedule() as any);
					}}
				>
					Pull media schedule
				</button>
			</ContentPanel>
		);
	}

	return (
		<ContentPanel
			mainActions={
				<>
					{/* <button
						className="btn btn-primary"
						onClick={() => {
							dispatch(
								setMediaSchedule(
									Object.values(editedMediaSchedule).map(({ name, timestamp }) => [name, timestamp])
								) as any
							);
						}}
					>
						<span>Save</span>
					</button> */}
					<button
						className="btn btn-primary"
						title="Fetch current spreadsheet state to app UI"
						onClick={() => {
							dispatch(fetchMediaSchedule() as any);
						}}
					>
						Refresh
					</button>
					<button
						className="btn btn-secondary ms-2"
						title="Update server data and fetch current spreadsheet state to app UI"
						onClick={() => {
							dispatch(pullMediaSchedule() as any);
						}}
					>
						Pull & refresh
					</button>
				</>
			}
			endActions={
				<button
					className="btn btn-secondary ms-2"
					onClick={() => {
						dispatch(resetMediaSchedule() as any);
					}}
				>
					<span>Reset</span>
				</button>
			}
		>
			<div className="video-schedule-list col-12 mb-3">
				<div className="container">
					<div className="stream-settings-video-list-head row mb-1">
						<div className="col-1">Enabled</div>
						<div className="col-5">Media name</div>
						<div className="col-2">Start time</div>
					</div>
					{Object.entries(editedMediaSchedule)
						.sort(([, a], [, b]) => Number(a.timestamp) - Number(b.timestamp))
						.map(([mediaId, item]) => {
							const { name, timestamp, is_enabled } = item;

							return (
								<div className="stream-settings-video-list-item row" key={mediaId}>
									<div className="col-1 d-flex align-items-center">
										<input
											className="form-check-input mt-0"
											type="checkbox"
											checked={is_enabled}
											onChange={(event) => {
												dispatch(
													updateMedia({
														id: mediaId,
														is_enabled: event.target.checked,
													}) as any
												);
											}}
										/>
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
													dispatch(playMedia(item) as any);
												}}
											>
												<i className="bi bi-play-fill me-1" />
												Play
											</button>
											{/* TODO wait until backend is fixed, stop now throws 500 error */}
											{/* <button
												className="btn btn-sm btn-primary ms-2"
												type="button"
												title="Stop"
												onClick={() => {
													dispatch(stopMedia() as any);
												}}
											>
												<i className="bi bi-stop-fill me-1" />
												Stop
											</button> */}
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
