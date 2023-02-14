import classNames from "classnames";
import { stopMedia } from "../services/soketApi";

type Props = {
	class?: string;
};

const StopMediaButton = ({ class: cls }: Props) => {
	return (
		<button
			className={classNames("btn btn-primary", cls)}
			type="button"
			title="Stops currently playing video/audio file."
			onClick={() => {
				if (window.confirm("Are you sure?") === true) {
					stopMedia();
				}
			}}
		>
			<i className="bi bi-stop-fill me-1" />
			Stop media
		</button>
	);
};

export default StopMediaButton;
