import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	removeVMixTriggerer,
	selectHostAddress,
	selectVMixTriggerers,
	setActiveVMixTriggerer,
	updateHostAddress,
} from "../store/slices/environment";
import ContentPanel from "./ContentPanel";

export const EnvironmentSettings: React.FC = () => {
	const dispatch = useDispatch();
	const [editedHostAddress, setEditedHostAddress] = useState(useSelector(selectHostAddress));
	const vMixTriggerers = useSelector(selectVMixTriggerers);

	return (
		<>
			<ContentPanel
				mainActions={
					<>
						<button
							className="btn btn-sm btn-primary"
							onClick={() => {
								dispatch(updateHostAddress(editedHostAddress));
							}}
						>
							<span>Save</span>
						</button>
					</>
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
			<ContentPanel>
				<label htmlFor="vmix-triggerers" className="form-label">
					vMix triggerers
				</label>
				{vMixTriggerers.map((vMixTriggerer) => {
					return (
						<div className="input-group mb-3" key={vMixTriggerer.id}>
							<div className="input-group-text">
								<input
									className="form-check-input mt-0"
									type="radio"
									checked={vMixTriggerer.active}
									onChange={() => dispatch(setActiveVMixTriggerer(vMixTriggerer.id))}
									aria-label="Radio button for following text input"
								/>
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{vMixTriggerer.ipAddress}
							</div>
							<button
								className="btn btn-outline-danger"
								type="button"
								onClick={() => {
									dispatch(removeVMixTriggerer(vMixTriggerer.id));
								}}
							>
								<i className="bi bi-trash" />
							</button>
						</div>
					);
				})}
			</ContentPanel>
		</>
	);
};

export default EnvironmentSettings;
