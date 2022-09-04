import { useState } from "react";
import { MediaSchedule } from "../services/types";
// import { MediaSchedule } from "../services/types";

type Props = {
	onImport: (videoSchedule: MediaSchedule) => void;
	onGoBackClicked: () => void;
};

const BulkImport: React.FC<Props> = ({ onGoBackClicked }: Props) => {
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

			<div className="mt-3 content-panel__actions">
				<button
					className="btn btn-primary"
					disabled={textareaText.trim().length === 0}
					onClick={async () => {
						// if (textareaText.length === 0) {
						// 	return;
						// }
						// const lines = textareaText.split("\n");
						// const mediaSchedule: MediaSchedule = lines.map((line) => {
						// 	const [name, secondsFromStart] = line.trim().split("\t");
						// 	return {
						// 		name,
						// 		secondsFromStart: Number(secondsFromStart),
						// 		alreadyPlayed: false,
						// 	};
						// });
						// onImport(mediaSchedule);
						// onGoBackClicked();
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
