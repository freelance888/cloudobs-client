import { useDispatch } from "react-redux";

import { LanguageSettings } from "../../../services/types";
import { startStreaming, stopStreaming } from "../../../store/slices/app";
import { AppDispatch } from "../../../store/store";

export type Props = {
	language: string;
	languageSettings: LanguageSettings;
};

const StreamActiveToggle = ({ language, languageSettings }: Props) => {
	const dispatch = useDispatch<AppDispatch>();

	const { streamActive } = languageSettings.streamParameters;

	return (
		<div className="form-check form-switch">
			<input
				className="form-check-input"
				type="checkbox"
				role="switch"
				id="stream-on"
				checked={streamActive}
				onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
					const active = event.target.checked;

					if (active) {
						await dispatch(startStreaming([language]));
					} else {
						await dispatch(stopStreaming([language]));
					}
				}}
			/>
		</div>
	);
};

export default StreamActiveToggle;
