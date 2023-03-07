import { useMemo } from "react";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { EMPTY_LANGUAGE_SETTINGS } from "../../../services/emptyData";
import { selectSyncedParameters, updateSyncedParameters } from "../../../store/slices/app";
import { AppDispatch } from "../../../store/store";
import { MinionConfig } from "../../../services/types";
import {
	pullConfig,
	refreshSource,
	setSidechainSettings,
	setSourceVolume,
	setTeamspeakOffset,
	setTeamspeakVolume,
	setTransitionSettings,
} from "../../../services/socketApi";

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
	languageSettings: MinionConfig;
	collapsed: boolean;
	onCollapsedToggled: () => void;
	videosData: Record<string, boolean>;
};

const Language: React.FC<LanguageProps> = ({
	language,
	languageSettings,
	collapsed,
	onCollapsedToggled,
	videosData,
}: LanguageProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const syncedParameters = useSelector(selectSyncedParameters);

	const serverIp = languageSettings.addr_config.minion_server_addr;

	const { source_volume, ts_volume, ts_offset } = languageSettings;
	const { ratio, release_time, threshold, output_gain } = languageSettings.sidechain_settings;

	const videosCounts = useMemo(() => {
		const downloadedVideosCount = Object.values(videosData).filter((videoStatus) => videoStatus).length;
		const allVideosCount = Object.values(videosData).length;
		return {
			downloaded: downloadedVideosCount || "-",
			all: allVideosCount || "-",
		};
	}, [language, videosData]);

	return (
		<div className={classNames(["Language", { "Language--live": languageSettings.stream_on.value, collapsed }])}>
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
					className="btn btn-sm btn-info ms-auto"
					title={`Refresh servers data from spreadsheet table and update UI for ${language}`}
					onClick={() => {
						pullConfig({ langs: [language] });
					}}
				>
					<i className="bi bi-arrow-clockwise" />
					Refresh data
				</button>

				<button
					className="btn btn-sm btn-dark ms-auto"
					title={`Refreshes original media source for ${language}`}
					onClick={() => {
						refreshSource(language);
					}}
				>
					<i className={"bi bi-eye"} />
					Refresh source
				</button>

				<button className="language-block-collapse-btn btn btn-sm ms-3" type="button" onClick={onCollapsedToggled}>
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
								value={source_volume.value}
								units={"dB"}
								onValueChanged={(value) => setSourceVolume(value, syncedParameters.sourceVolume ? undefined : language)}
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
								value={ts_volume.value}
								units={"dB"}
								onValueChanged={(value) =>
									setTeamspeakVolume(value, syncedParameters.translationVolume ? undefined : language)
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
								value={ts_offset.value}
								units={"ms"}
								onValueChanged={(value) =>
									setTeamspeakOffset(value, syncedParameters.translationOffset ? undefined : language)
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
								onValueChanged={(updatedRatio) => setSidechainSettings({ ratio: updatedRatio }, language)}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ ratio: updatedSyncAll }))}
							/>

							<RangeInput
								label="Release"
								minValue={1}
								maxValue={1000}
								value={release_time}
								// syncAll={syncedParameters.release_time}
								units={"ms"}
								onValueChanged={(updatedRelease) => setSidechainSettings({ release_time: updatedRelease }, language)}
								// onSyncAllChanged={(updatedSyncAll) => dispatch(updateSyncedParameters({ release_time: updatedSyncAll }))}
							/>

							<RangeInput
								label="Threshold"
								minValue={-60}
								maxValue={0}
								value={threshold}
								// syncAll={syncedParameters.threshold}
								units={"dB"}
								onValueChanged={(updatedThreshold) => setSidechainSettings({ threshold: updatedThreshold }, language)}
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
									setSidechainSettings({ output_gain: updatedOutputGain }, language)
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
									languageSettings.transition_settings?.transition_point ||
									EMPTY_LANGUAGE_SETTINGS.transition?.transition_point
								}
								syncAll={syncedParameters?.transition_point}
								units={"ms"}
								onValueChanged={(updatedTransitionPoint) => {
									setTransitionSettings(
										updatedTransitionPoint,
										syncedParameters.transition_point ? undefined : language
									);
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
