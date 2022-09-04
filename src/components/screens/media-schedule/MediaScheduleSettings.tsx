import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MediaSchedule } from "../../../services/types";
import {
	playMedia,
	resetMediaSchedule,
	selectMediaSchedule,
	setMediaSchedule,
	stopMedia,
	updateMedia,
} from "../../../store/slices/media-schedule";
import ContentPanel from "../../ContentPanel";

export const MediaScheduleSettings = () => {
	const dispatch = useDispatch();

	const mediaSchedule = useSelector(selectMediaSchedule);

	const [editedMediaSchedule, setEditedMediaSchedule] = useState<MediaSchedule>({});

	useEffect(() => {
		setEditedMediaSchedule(mediaSchedule);
	}, [mediaSchedule]);

	return (
		<ContentPanel
			mainActions={
				<>
					<button
						className="btn btn-primary"
						onClick={async () => {
							dispatch(
								setMediaSchedule(
									Object.values(editedMediaSchedule).map(({ name, timestamp }) => [name, timestamp])
								) as any
							);
						}}
					>
						<span>Save</span>
					</button>

					<button
						className="btn btn-secondary ms-2"
						onClick={async () => {
							dispatch(resetMediaSchedule() as any);
						}}
					>
						<span>Reset</span>
					</button>
				</>
			}
		>
			<div className="video-schedule-list col-10 mb-3">
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
											<input
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
											/>
										</div>
									</div>
									<div className="col-4 d-flex justify-content-end">
										<div>
											<button
												className="btn btn-sm btn-success"
												type="button"
												title="Play now"
												onClick={() => {
													dispatch(playMedia(name) as any);
												}}
											>
												<i className="bi bi-play-fill me-1" />
												Play
											</button>
											<button
												className="btn btn-sm btn-primary ms-2"
												type="button"
												title="Stop"
												onClick={() => {
													dispatch(stopMedia() as any);
												}}
											>
												<i className="bi bi-stop-fill me-1" />
												Stop
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
