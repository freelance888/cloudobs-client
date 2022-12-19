import { useMemo } from "react";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import useLogger from "../../../hooks/useLogger";
import { EMPTY_LANGUAGE_SETTINGS } from "../../../services/emptyData";
import { LanguageSettings } from "../../../services/types";
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
import { AppDispatch } from "../../../store/store";

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
	const dispatch = useDispatch<AppDispatch>();
	const { logSuccess } = useLogger();

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

		const downloadedVideosCount = languageVideosData.filter(([, videoStatus]) => videoStatus === true).length;
		const allVideosCount = languageVideosData.length;

		return {
			downloaded: downloadedVideosCount,
			all: allVideosCount,
		};
	}, [language, videosData]);

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
						dispatch(refreshSource([language]));
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
								onValueChanged={(updatedSourceVolume) => dispatch(setSourceVolume({ [language]: updatedSourceVolume }))}
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
									dispatch(setTranslationVolume({ [language]: updatedTranslationVolume }))
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
									dispatch(setTranslationOffset({ [language]: updatedTranslationOffset }))
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
								onValueChanged={(updatedRatio) => dispatch(setSidechain({ [language]: { ratio: updatedRatio } }))}
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
									dispatch(setSidechain({ [language]: { release_time: updatedRelease } }))
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
									dispatch(setSidechain({ [language]: { threshold: updatedThreshold } }))
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
									dispatch(setSidechain({ [language]: { output_gain: updatedOutputGain } }))
								}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ output_gain: updatedSyncAll }))}
							/>
						</div>

						<div className="language-transition-settings px-3">
							<h6>Transition</h6>
							<RangeInput
								label="Transition point"
								minValue={MIN_TRANSITION_POINT}
								maxValue={MAX_TRANSITION_POINT}
								step={TRANSITION_POINT_STEP}
								value={
									languageSettings.transition?.transition_point || EMPTY_LANGUAGE_SETTINGS.transition?.transition_point
								}
								syncAll={syncedParameters?.transition_point}
								units={"ms"}
								onValueChanged={(updatedTransitionPoint) => {
									dispatch(setTransition({ [language]: { transition_point: updatedTransitionPoint } }));
									if (syncedParameters.transition_point) {
										dispatch(
											setTransition({
												__all__: { transition_point: updatedTransitionPoint },
											})
										);
									}
								}}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ transition_point: updatedSyncAll }))
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Language;
