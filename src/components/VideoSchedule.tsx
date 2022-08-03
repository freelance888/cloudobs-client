import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VideoRecord, VideoSchedule as VideoScheduleType } from "../services/types";
import { playMedia, selectVideoSchedule, setVideoSchedule } from "../store/slices/app";
import BulkImport from "./BulkImport";
import ContentPanel from "./ContentPanel";

export const VideoSchedule = () => {
	const dispatch = useDispatch();

	const videoSchedule = useSelector(selectVideoSchedule);

	const [videoName, setVideoName] = useState("");
	const [videoTiming, setVideoTiming] = useState<number>(0);
	const [editedVideoSchedule, setEditedVideoSchedule] = useState<VideoScheduleType>(videoSchedule);
	const [bulkImportOpen, setBulkImportOpen] = useState(false);
	const [editedVideoRecordIndex, setEditedVideoRecordIndex] = useState<number | null>(null);
	const [editedVideoRecord, setEditedVideoRecord] = useState<VideoRecord>();

	return (
		<ContentPanel>
			{!bulkImportOpen && (
				<div>
					<div className="video-schedule-list col-10 mb-3">
						<div className="container">
							<div className="stream-settings-video-list-head row mb-1">
								<div className="col-5">Media name</div>
								<div className="col-3">Start time</div>
								<div className="col-2"></div>
							</div>
							{editedVideoSchedule.map((videoRecord, index) => {
								return (
									<div className="stream-settings-video-list-item row" key={videoRecord.name}>
										<div className="col-5">
											{editedVideoRecordIndex === index && editedVideoRecord ? (
												<div key={`edited-${index}-name`}>
													<input
														type="text"
														className="form-control"
														value={editedVideoRecord?.name}
														onChange={(event) => {
															setEditedVideoRecord({
																...editedVideoRecord,
																name: event.target.value,
															});
														}}
													/>
												</div>
											) : (
												<div>{videoRecord.name}</div>
											)}
										</div>
										<div className="col-3">
											{editedVideoRecordIndex === index && editedVideoRecord ? (
												<div key={`edited-${index}-seconds`}>
													<input
														type="number"
														className="form-control"
														value={editedVideoRecord?.secondsFromStart}
														onChange={(event) => {
															setEditedVideoRecord({
																...editedVideoRecord,
																secondsFromStart: Number(event.target.value),
															});
														}}
													/>
												</div>
											) : (
												<div>{videoRecord.secondsFromStart}</div>
											)}
										</div>
										<div className="col-4 d-flex justify-content-end">
											{editedVideoRecordIndex === index && editedVideoRecord ? (
												<div>
													<button
														className="btn btn-sm btn-outline-secondary me-2"
														type="button"
														title="Cancel"
														onClick={() => {
															setEditedVideoRecordIndex(null);
														}}
													>
														Cancel
													</button>
													<button
														className="btn btn-sm btn-success"
														type="button"
														title="Save"
														onClick={() => {
															const updatedVideoSchedule = [...editedVideoSchedule];
															updatedVideoSchedule[index] = { ...editedVideoRecord };

															setEditedVideoSchedule(updatedVideoSchedule);
															setEditedVideoRecordIndex(null);
														}}
													>
														Save
													</button>
												</div>
											) : (
												<div>
													{!videoRecord.alreadyPlayed && (
														<button
															className="btn btn-sm btn-success"
															type="button"
															title="Play now"
															onClick={() => {
																dispatch(playMedia(videoRecord.name) as any);
																const updatedVideoSchedule = [...editedVideoSchedule];
																updatedVideoSchedule[index] = {
																	...updatedVideoSchedule[index],
																	alreadyPlayed: true,
																};

																setEditedVideoSchedule(updatedVideoSchedule);
															}}
														>
															<i className="bi bi-play-fill me-1" />
															Play now
														</button>
													)}
													{!videoRecord.alreadyPlayed && (
														<button
															className="btn btn-sm btn-secondary ms-3"
															type="button"
															title="Edit"
															onClick={() => {
																setEditedVideoRecord({ ...videoRecord });
																setEditedVideoRecordIndex(index);
															}}
														>
															<i className="bi bi-pencil-fill me-0" />
														</button>
													)}
													<button
														className="btn btn-sm btn-primary ms-3"
														type="button"
														title="Remove"
														onClick={() => {
															const updatedVideoSchedule = [...editedVideoSchedule];
															updatedVideoSchedule.splice(index, 1);
															console.log("# UPD", updatedVideoSchedule);

															setEditedVideoSchedule(updatedVideoSchedule);
														}}
													>
														<i className="bi bi-trash-fill me-0" />
													</button>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="col-md-10">
						<div className="container">
							<div className="input-group row mb-3">
								<div className="col-5">
									<input
										type="text"
										className="form-control"
										value={videoName}
										onChange={(event) => setVideoName(event.target.value)}
									/>
								</div>
								<div className="col-4">
									<input
										type="number"
										className="form-control"
										value={videoTiming}
										onChange={(event) => setVideoTiming(Number(event.target.value))}
									/>
								</div>
								<div className="col-1">
									<button
										className="btn btn-outline-primary"
										type="button"
										onClick={() => {
											if (!editedVideoSchedule.find((video) => video.name === videoName)) {
												setEditedVideoSchedule([
													...editedVideoSchedule,
													{
														name: videoName,
														secondsFromStart: videoTiming,
														alreadyPlayed: false,
													},
												]);
											}
										}}
									>
										Add
									</button>
								</div>
								<div className="col-1">
									<button
										className="btn btn-outline-secondary"
										type="button"
										onClick={() => {
											setVideoName("");
											setVideoTiming(0);
										}}
									>
										Clear
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-3 content-panel_actions">
						<button
							className="btn btn-primary"
							onClick={async () => {
								dispatch(setVideoSchedule(editedVideoSchedule) as any);
								// await dispatch(initialize(updatedLanguagesSettings) as any);
								// onClose();
							}}
						>
							<span>Save</span>
						</button>
						<button
							className="btn btn-success ms-2"
							onClick={() => {
								setBulkImportOpen(true);
							}}
						>
							Bulk import
						</button>
					</div>
				</div>
			)}

			{bulkImportOpen && (
				<BulkImport
					onImport={(videoSchedule) => setEditedVideoSchedule(videoSchedule)}
					onGoBackClicked={() => setBulkImportOpen(false)}
				/>
			)}
		</ContentPanel>
	);
};

export default VideoSchedule;
