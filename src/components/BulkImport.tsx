import { useState } from "react";
import { VideoSchedule } from "../services/types";

type Props = {
	onImport: (videoSchedule: VideoSchedule) => void;
	onGoBackClicked: () => void;
};

const BulkImport: React.FC<Props> = ({ onImport, onGoBackClicked }: Props) => {
	const [textareaText, setTextareaText] = useState("");

	return (
		<div>
			<div className="col-12">
				<textarea
					className="form-control"
					value={textareaText}
					rows={10}
					onChange={(event) => setTextareaText(event.target.value)}
					onBlur={() => setTextareaText(textareaText.trim())}
				/>
			</div>

			<div className="mt-3 stream-settings-buttons">
				<button
					className="btn btn-primary"
					onClick={async () => {
						const lines = textareaText.split("\n");

						const videoSchedule: VideoSchedule = lines.map((line) => {
							const [name, secondsFromStart] = line.trim().split("\t");
							return {
								name,
								secondsFromStart: Number(secondsFromStart),
								alreadyPlayed: false,
							};
						});

						onImport(videoSchedule);
						onGoBackClicked();
					}}
				>
					<i className={"bi bi-cloud-arrow-up"} />
					<span>Import</span>
				</button>
				<button
					className="btn btn-secondary btn-cancel ms-2"
					onClick={() => {
						onGoBackClicked();
					}}
				>
					Go back
				</button>
			</div>
		</div>
	);
};

export default BulkImport;
