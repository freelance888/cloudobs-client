import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLogger from "../../../hooks/useLogger";
import { EMPTY_LANGUAGE_SETTINGS } from "../../../services/emptyData";
import { LanguageSettings, TransitionSettings } from "../../../services/types";
import {
	refreshSource,
	selectSyncedParameters,
	selectVideosData,
	setSidechain,
	setSourceVolume,
	setTransition,
	setTranslationOffset,
	setTranslationVolume,
	updateSyncedParameters,
} from "../../../store/slices/app";
import EditableStreamDestinationSettings from "./EditableStreamDestinationSettings";
import RangeInput from "./RangeInput";
import StreamActiveToggle from "./StreamActiveToggle";

const MIN_TS_OFFSET = 0;
const MAX_TS_OFFSET = 20000;
const TS_OFFSET_STEP = 500;

const MIN_TS_VOLUME = -100;
const MAX_TS_VOLUME = 0;

const MIN_SOURCE_VOLUME = -100;
const MAX_SOURCE_VOLUME = 0;

const MIN_TRANSITION_POINT = 0;
const MAX_TRANSITION_POINT = 20000;
const TRANSITION_POINT_STEP = 100;

export type LanguageProps = {
	language: string;
	languageSettings: LanguageSettings;
	collapsed: boolean;
	onCollapsedToggled: () => void;
};

const Language: React.FC<LanguageProps> = ({
	language,
	languageSettings,
	collapsed,
	onCollapsedToggled,
}: LanguageProps) => {
	const dispatch = useDispatch();
	const { logSuccess } = useLogger();
	const [editedTransitionSettings, setEditedTransitionSettings] = useState<TransitionSettings>(
		languageSettings.transition || EMPTY_LANGUAGE_SETTINGS.transition
	);

	const syncedParameters = useSelector(selectSyncedParameters);

	const serverIp: string = languageSettings.initial.host_url.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)?.[0] || "";

	const { sourceVolume, translationVolume, translationOffset } = languageSettings.streamParameters;
	const { ratio, release_time, threshold, output_gain } = languageSettings.sidechain;

	const videosData = useSelector(selectVideosData);

	const videosCounts = useMemo(() => {
		if (!videosData[language]) {
			return {
				downloaded: "-",
				all: "-",
			};
		}

		const languageVideosData = videosData[language];

		const downloadedVideosCount = languageVideosData.filter(([_, videoStatus]) => videoStatus === true).length;
		const allVideosCount = languageVideosData.length;

		return {
			downloaded: downloadedVideosCount,
			all: allVideosCount,
		};
	}, [videosData[language]]);

	useEffect(() => {
		setEditedTransitionSettings((previousTransitionSettings) => ({
			...previousTransitionSettings,
			transition_point: languageSettings.transition.transition_point,
		}));
	}, [languageSettings.transition.transition_point]);

	return (
		<div
			className={classNames([
				"Language",
				{ "Language--live": languageSettings.streamParameters.streamActive, collapsed },
			])}
		>
			<div className="language-header">
				<StreamActiveToggle language={language} languageSettings={languageSettings} />
				<div className="language-name">
					<span className="language-name-short">{language}</span>
					<span
						className="language-name-ip ms-2"
						title="Click to copy"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(serverIp);
								logSuccess(`Server IP '${serverIp}' copied to clipboard`);
							} catch (error) {
								// pass
							}
						}}
					>
						({serverIp})
					</span>
				</div>
				<EditableStreamDestinationSettings language={language} languageSettings={languageSettings} />

				<div
					className={classNames("videos-downloaded-counter ms-2", {
						"videos-downloaded-counter--failed": videosCounts.downloaded !== videosCounts.all,
					})}
				>
					Videos: {videosCounts.downloaded} / {videosCounts.all}
				</div>

				<button
					className="btn btn-sm btn-dark ms-auto"
					onClick={() => {
						dispatch(refreshSource([language]) as any);
					}}
				>
					<i className={"bi bi-eye"} />
					Refresh source
				</button>

				<button className="language-block-collapse-btn btn btn-sm ms-5" type="button" onClick={onCollapsedToggled}>
					<i className={classNames("bi bi-no-margin", collapsed ? "bi-chevron-down" : "bi-chevron-up")} />
				</button>
			</div>

			<div className="language-body">
				<div className="mt-2">
					<div className="language-settings-block mt-2">
						<div className="language-settings pe-3">
							<h6>Volume</h6>
							<RangeInput
								label="Source volume"
								icon="volume-up-fill"
								minValue={MIN_SOURCE_VOLUME}
								maxValue={MAX_SOURCE_VOLUME}
								syncAll={syncedParameters.sourceVolume}
								value={sourceVolume}
								units={"dB"}
								onValueChanged={(updatedSourceVolume) =>
									dispatch(setSourceVolume({ [language]: updatedSourceVolume }) as any)
								}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ sourceVolume: updatedSyncAll }))
								}
							/>

							<RangeInput
								label="Translation volume"
								icon="volume-up-fill"
								minValue={MIN_TS_VOLUME}
								maxValue={MAX_TS_VOLUME}
								syncAll={syncedParameters.translationVolume}
								value={translationVolume}
								units={"dB"}
								onValueChanged={(updatedTranslationVolume) =>
									dispatch(setTranslationVolume({ [language]: updatedTranslationVolume }) as any)
								}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ translationVolume: updatedSyncAll }))
								}
							/>

							<RangeInput
								label="Translation offset"
								icon="stopwatch-fill"
								minValue={MIN_TS_OFFSET}
								maxValue={MAX_TS_OFFSET}
								step={TS_OFFSET_STEP}
								syncAll={syncedParameters.translationOffset}
								value={translationOffset}
								units={"ms"}
								onValueChanged={(updatedTranslationOffset) =>
									dispatch(setTranslationOffset({ [language]: updatedTranslationOffset }) as any)
								}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ translationOffset: updatedSyncAll }))
								}
							/>
						</div>

						<div className="language-sidechain-settings px-3">
							<h6>Sidechain</h6>
							<RangeInput
								label="Ratio"
								minValue={1}
								maxValue={32}
								value={ratio}
								// syncAll={syncedParameters.ratio}
								units={": 1"}
								onValueChanged={(updatedRatio) =>
									dispatch(setSidechain({ [language]: { ratio: updatedRatio } }) as any)
								}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ ratio: updatedSyncAll }))}
							/>

							<RangeInput
								label="Release"
								minValue={1}
								maxValue={1000}
								value={release_time}
								// syncAll={syncedParameters.release_time}
								units={"ms"}
								onValueChanged={(updatedRelease) =>
									dispatch(setSidechain({ [language]: { release_time: updatedRelease } }) as any)
								}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ release_time: updatedSyncAll }))}
							/>

							<RangeInput
								label="Threshold"
								minValue={-60}
								maxValue={0}
								value={threshold}
								// syncAll={syncedParameters.threshold}
								units={"dB"}
								onValueChanged={(updatedThreshold) =>
									dispatch(setSidechain({ [language]: { threshold: updatedThreshold } }) as any)
								}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ threshold: updatedSyncAll }))}
							/>

							<RangeInput
								label="Output gain"
								minValue={-32}
								maxValue={32}
								value={output_gain}
								// syncAll={syncedParameters.output_gain}
								units={"dB"}
								onValueChanged={(updatedOutputGain) =>
									dispatch(setSidechain({ [language]: { output_gain: updatedOutputGain } }) as any)
								}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ output_gain: updatedSyncAll }))}
							/>
						</div>

						<div className="language-transition-settings px-3">
							<h6>Transition</h6>
							<label htmlFor="transition-type">
								Type
								<div
									id="transition-type"
									className="btn-group btn-group-sm my-2 d-flex"
									role="group"
									aria-label="Transition type"
								>
									<input
										type="radio"
										className="btn-check"
										name={`btnradio-${language}`}
										id={`btnradio1-${language}`}
										checked={editedTransitionSettings.transition_name === "Cut"}
										onChange={() => {
											setEditedTransitionSettings((previousTransitionSettings) => ({
												...previousTransitionSettings,
												transition_name: "Cut",
											}));
										}}
									/>
									<label
										className={`btn btn-${editedTransitionSettings.transition_name === "Cut" ? "" : "outline-"}primary`}
										htmlFor={`btnradio1-${language}`}
									>
										Cut
									</label>

									<input
										type="radio"
										className="btn-check"
										name={`btnradio-${language}`}
										id={`btnradio2-${language}`}
										checked={editedTransitionSettings.transition_name === "Stinger"}
										onChange={() => {
											setEditedTransitionSettings((previousTransitionSettings) => ({
												...previousTransitionSettings,
												transition_name: "Stinger",
											}));
										}}
									/>
									<label
										className={`btn btn-${
											editedTransitionSettings.transition_name === "Stinger" ? "" : "outline-"
										}primary`}
										htmlFor={`btnradio2-${language}`}
									>
										Stinger
									</label>
								</div>
							</label>

							<label htmlFor="stinger-filename" className="mb-2">
								Stinger filename
								<input
									type="text"
									value={editedTransitionSettings.path}
									disabled={editedTransitionSettings.transition_name !== "Stinger"}
									onChange={(event) => {
										setEditedTransitionSettings((previousTransitionSettings) => ({
											...previousTransitionSettings,
											path: event.target.value,
										}));
									}}
								/>
							</label>

							<RangeInput
								label="Transition point"
								minValue={MIN_TRANSITION_POINT}
								maxValue={MAX_TRANSITION_POINT}
								step={TRANSITION_POINT_STEP}
								value={editedTransitionSettings.transition_point}
								syncAll={syncedParameters.transition_point}
								units={"ms"}
								onValueChanged={(updatedTransitionPoint) => {
									// dispatch(setTransition({ [language]: { transition_point: updatedTransitionPoint } }) as any)
									setEditedTransitionSettings((previousTransitionSettings) => ({
										...previousTransitionSettings,
										transition_point: updatedTransitionPoint,
									}));
								}}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ transition_point: updatedSyncAll }))
								}
							/>

							<button
								className="btn btn-sm btn-primary mt-2"
								onClick={async () => {
									await dispatch(setTransition({ [language]: editedTransitionSettings }) as any);

									const syncAllTransitionPoints = syncedParameters.transition_point;
									if (syncAllTransitionPoints) {
										dispatch(
											setTransition({
												__all__: { transition_point: editedTransitionSettings.transition_point },
											}) as any
										);
									}
								}}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Language;
