import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HostAddress, selectHostAddress, updateHostAddress } from "../store/slices/app";
import ContentPanel from "./ContentPanel";

const LS_KEY_HOST_ADDRESS = "cloudobs__host_address";

const DEFAULT_HOST_ADDRESS: HostAddress = {
	protocol: "http",
	ipAddress: "localhost",
	port: "5000",
};

export const loadHostAddress = () => {
	const hostAddrSerialized = localStorage.getItem(LS_KEY_HOST_ADDRESS);
	const hostAddress: HostAddress = hostAddrSerialized ? JSON.parse(hostAddrSerialized) : DEFAULT_HOST_ADDRESS;
	return hostAddress;
};

export const EnvironmentSettings: React.FC = () => {
	const dispatch = useDispatch();
	const [editedHostAddress, setEditedHostAddress] = useState(useSelector(selectHostAddress));

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-primary"
					onClick={() => {
						localStorage.setItem(LS_KEY_HOST_ADDRESS, JSON.stringify(editedHostAddress));
						dispatch(updateHostAddress(editedHostAddress));
					}}
				>
					<span>Save</span>
				</button>
			}
		>
			<label htmlFor="server-ip" className="form-label">
				Host server address
			</label>
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					style={{ maxWidth: "80px" }}
					placeholder="http"
					aria-label="Protocol"
					value={editedHostAddress.protocol}
					onChange={(event) =>
						setEditedHostAddress({
							...editedHostAddress,
							protocol: event.target.value,
						})
					}
				/>
				<span className="input-group-text">://</span>
				<input
					type="text"
					className="form-control"
					style={{ maxWidth: "160px" }}
					placeholder="IP address"
					aria-label="IP address"
					value={editedHostAddress.ipAddress}
					onChange={(event) =>
						setEditedHostAddress({
							...editedHostAddress,
							ipAddress: event.target.value,
						})
					}
				/>
				<span className="input-group-text">:</span>
				<input
					type="text"
					className="form-control"
					style={{ maxWidth: "80px" }}
					placeholder="Port"
					aria-label="Port"
					value={editedHostAddress.port}
					onChange={(event) =>
						setEditedHostAddress({
							...editedHostAddress,
							port: event.target.value,
						})
					}
				/>
				<button
					className="btn btn-sm btn-outline-danger"
					type="button"
					onClick={() => {
						setEditedHostAddress(DEFAULT_HOST_ADDRESS);
					}}
				>
					Reset to default
				</button>
			</div>
		</ContentPanel>
	);
};

export default EnvironmentSettings;
