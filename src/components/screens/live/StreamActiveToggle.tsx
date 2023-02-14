import { startStreaming, stopStreaming } from "../../../services/soketApi";

import { MinionConfig } from "../../../services/types";

export type Props = {
	language: string;
	languageSettings: MinionConfig;
};

const StreamActiveToggle = ({ language, languageSettings }: Props) => {
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
						startStreaming(language);
					} else {
						stopStreaming(language);
					}
				}}
			/>
		</div>
	);
};

export default StreamActiveToggle;
