import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	initializeVMixPlayers,
	selectHostAddress,
	selectVMixPlayers,
	setVMixPlayerActive,
	updateHostAddress,
} from "../store/slices/environment";
import ContentPanel from "./ContentPanel";

export const EnvironmentSettings: React.FC = () => {
	const dispatch = useDispatch();
	const [editedHostAddress, setEditedHostAddress] = useState(useSelector(selectHostAddress));
	const vMixPlayers = useSelector(selectVMixPlayers);
	const [newVMixPlayer, setNewVMixPlayer] = useState("");

	const allActive = Object.keys(vMixPlayers).every((ip) => !!vMixPlayers[ip]);

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
					vMix players
				</label>

				<div className="input-group mb-1">
					<div className="input-group-text">
						<input
							className="form-check-input mt-0"
							type="radio"
							checked={allActive}
							onChange={() => dispatch(setVMixPlayerActive("*") as any)}
							aria-label="Radio button for following text input"
						/>
					</div>
					<div className="form-control" style={{ maxWidth: "160px" }}>
						All active
					</div>
				</div>

				{Object.keys(vMixPlayers).map((ip) => {
					return (
						<div className="input-group mb-1" key={ip}>
							<div className="input-group-text">
								<input
									className="form-check-input mt-0"
									type="radio"
									checked={vMixPlayers[ip] && !allActive}
									onChange={() => dispatch(setVMixPlayerActive(ip) as any)}
									aria-label="Radio button for following text input"
								/>
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{ip}
							</div>
						</div>
					);
				})}

				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						style={{ maxWidth: "200px" }}
						placeholder="IP address"
						aria-label="IP address"
						value={newVMixPlayer}
						onChange={(event) => setNewVMixPlayer(event.target.value)}
					/>
					<button
						className="btn btn-outline-primary"
						type="button"
						onClick={() => {
							console.log("newVMixTriggerer", newVMixPlayer);

							dispatch(initializeVMixPlayers([...Object.keys(vMixPlayers), newVMixPlayer]) as any);
						}}
					>
						Add
					</button>
				</div>
			</ContentPanel>
		</>
	);
};

export default EnvironmentSettings;
