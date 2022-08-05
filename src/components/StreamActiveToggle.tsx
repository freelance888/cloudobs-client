import { useDispatch } from "react-redux";
import { LanguageSettings } from "../services/types";
import { startStreaming, stopStreaming } from "../store/slices/app";

export type Props = {
	language: string;
	languageSettings: LanguageSettings;
};

const StreamActiveToggle = ({ language, languageSettings }: Props) => {
	const dispatch = useDispatch();

	const { streamActive } = languageSettings.streamParameters;

	return (
		<div className="form-check form-switch" onClick={() => {}}>
			<input
				className="form-check-input"
				type="checkbox"
				role="switch"
				id="stream-on"
				checked={streamActive}
				onChange={async (event) => {
					const active = (event.target as any).checked;

					if (active) {
						await dispatch(startStreaming([language]) as any);
					} else {
						await dispatch(stopStreaming([language]) as any);
					}
				}}
			/>
		</div>
	);
};

export default StreamActiveToggle;
