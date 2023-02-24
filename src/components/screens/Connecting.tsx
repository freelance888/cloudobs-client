import { useSelector } from "react-redux";
import { selectSocketConnectionStatus, SocketConnectionStatus } from "../../store/slices/app";
import ContentPanel from "../ContentPanel";
import HostAddressSelection from "./HostAddressSelection";

const Connecting: React.FC = () => {
	const connectionStatus = useSelector(selectSocketConnectionStatus);

	switch (connectionStatus) {
		case SocketConnectionStatus.CONNECTING:
			return (
				<ContentPanel>
					<h6>Connecting...</h6>
				</ContentPanel>
			);
		case SocketConnectionStatus.FAILED:
			return (
				<ContentPanel>
					<h6>Connection failed. You can set the address manually:</h6>
					<div>
						<HostAddressSelection />
					</div>
				</ContentPanel>
			);
	}
};

export default Connecting;
