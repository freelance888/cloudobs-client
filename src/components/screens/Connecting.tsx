import { useSelector } from "react-redux";
import { selectSocketConnectionStatus, SocketConnectionStatus } from "../../store/slices/app";
import { buildUrlFromHostAddress, selectHostAddress } from "../../store/slices/environment";
import ContentPanel from "../ContentPanel";
import HostAddressSelection from "./HostAddressSelection";

const Connecting: React.FC = () => {
	const connectionStatus = useSelector(selectSocketConnectionStatus);
	const hostAddress = useSelector(selectHostAddress);

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
					<h6>
						Connection to <span className="red-text">{buildUrlFromHostAddress(hostAddress)}</span> failed. You can set
						the address manually:
					</h6>
					<div>
						<HostAddressSelection />
					</div>
				</ContentPanel>
			);
	}
};

export default Connecting;
