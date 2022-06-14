import classNames from "classnames";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	MIN_SOURCE_VOLUME,
	MAX_SOURCE_VOLUME,
	MIN_TS_VOLUME,
	MAX_TS_VOLUME,
	MIN_TS_OFFSET,
	MAX_TS_OFFSET,
	TS_OFFSET_STEP,
} from "../App";
import { LanguageSettings } from "../services/types";
import {
	selectSyncedParameters,
	setSidechain,
	setSourceVolume,
	setTranslationOffset,
	setTranslationVolume,
	updateSyncedParameters,
} from "../store/slices/app";
import EditableStreamDestinationSettings from "./EditableStreamDestinationSettings";
import RangeInput from "./RangeInput";
import StreamActiveToggle from "./StreamActiveToggle";

export type LanguageProps = {
	language: string;
	languageSettings: LanguageSettings;
};

const Language: React.FC<LanguageProps> = ({ language, languageSettings }: LanguageProps) => {
	const dispatch = useDispatch();
	const [collapsed, setCollapsed] = useState(false);

	const syncedParameters = useSelector(selectSyncedParameters);

	const { sourceVolume, translationVolume, translationOffset } = languageSettings.streamParameters;
	const { ratio, release_time, threshold } = languageSettings.sidechain;

	return (
		<div
			className={classNames([
				"Language",
				{ "Language--live": languageSettings.streamParameters.streamActive, collapsed },
			])}
		>
			<div className="language-header" onClick={() => setCollapsed(!collapsed)}>
				<StreamActiveToggle language={language} languageSettings={languageSettings} />
				<div className="language-name">{language}</div>
				<EditableStreamDestinationSettings language={language} languageSettings={languageSettings} />
			</div>

			<div className="language-body">
				<div className="mt-2">
					<div className="language-settings-block mt-2">
						<div className="language-settings">
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
								onValueChanged={(updatedTranslationOffset) =>
									dispatch(setTranslationOffset({ [language]: updatedTranslationOffset }) as any)
								}
								onSyncAllChanged={(updatedSyncAll) =>
									dispatch(updateSyncedParameters({ translationOffset: updatedSyncAll }))
								}
							/>
						</div>

						<div className="language-extra-settings ms-5">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Language;
