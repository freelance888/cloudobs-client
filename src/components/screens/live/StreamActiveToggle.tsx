import { useDispatch } from "react-redux";

import { MinionConfig } from "../../../services/types";
import { startStreaming, stopStreaming } from "../../../store/slices/app";
import { AppDispatch } from "../../../store/store";

export type Props = {
	language: string;
	languageSettings: MinionConfig;
};

const StreamActiveToggle = ({ language, languageSettings }: Props) => {
	const dispatch = useDispatch<AppDispatch>();

	const { stream_on } = languageSettings;

	return (
		<div className="form-check form-switch">
			<input
				className="form-check-input"
				type="checkbox"
				role="switch"
				id="stream-on"
				checked={!!stream_on}
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
