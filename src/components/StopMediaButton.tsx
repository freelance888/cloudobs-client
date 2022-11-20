import classNames from "classnames";
import { useDispatch } from "react-redux";
import { stopMedia } from "../store/slices/media-schedule";

type Props = {
	class?: string;
};

const StopMediaButton = ({ class: cls }: Props) => {
	const dispatch = useDispatch();

	return (
		<button
			className={classNames("btn btn-primary", cls)}
			type="button"
			title="Stops currently playing video/audio file."
			onClick={() => {
				if (window.confirm("Are you sure?") === true) {
					dispatch(stopMedia() as any);
				}
			}}
		>
			<i className="bi bi-stop-fill me-1" />
			Stop media
		</button>
	);
};

export default StopMediaButton;
