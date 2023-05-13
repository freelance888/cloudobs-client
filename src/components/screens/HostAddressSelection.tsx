import { useDispatch, useSelector } from "react-redux";
import ContentPanel from "../ContentPanel";
import { selectHostAddress, updateHostAddress } from "../../store/slices/environment";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import { connectionInitiated } from "../../store/slices/app";

const HostAddressSelection: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [editedHostAddress, setEditedHostAddress] = useState(useSelector(selectHostAddress));

	return (
		<ContentPanel
			mainActions={
				<button
					className="btn btn-sm btn-primary"
					onClick={() => {
						dispatch(updateHostAddress(editedHostAddress));
						dispatch(connectionInitiated());
					}}
				>
					<span>Save</span>
				</button>
			}
		>
			<label htmlFor="server-ip" className="form-label">
				Host server address
			</label>
			<div className="form-check mb-3">
				<input
					id="use-localhost"
					className="form-check-input"
					type="checkbox"
					checked={editedHostAddress.useLocalhost}
					onChange={() =>
						setEditedHostAddress({
							...editedHostAddress,
							useLocalhost: !editedHostAddress.useLocalhost,
						})
					}
				/>
				<label htmlFor="use-localhost" className="form-check-label">
					Use localhost
				</label>
			</div>

			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					style={{ maxWidth: "80px" }}
					disabled={editedHostAddress.useLocalhost}
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
					disabled={editedHostAddress.useLocalhost}
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
					disabled={editedHostAddress.useLocalhost}
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
			</div>
		</ContentPanel>
	);
};

export default HostAddressSelection;
