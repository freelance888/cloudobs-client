import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NewVMixPlayer } from "../../../services/types";
import {
	initializeVMixPlayers,
	selectHostAddress,
	selectVMixPlayers,
	setVMixPlayerActive,
	updateHostAddress,
} from "../../../store/slices/environment";
import ContentPanel from "../../ContentPanel";

const INITIAL_NEW_VMIX_PLAYER: NewVMixPlayer = { ip: "", label: "" };

export const EnvironmentSettings: React.FC = () => {
	const dispatch = useDispatch();
	const [editedHostAddress, setEditedHostAddress] = useState(useSelector(selectHostAddress));
	const vMixPlayers = useSelector(selectVMixPlayers);
	const [newVMixPlayer, setNewVMixPlayer] = useState<NewVMixPlayer>(INITIAL_NEW_VMIX_PLAYER);

	const allActive = Object.values(vMixPlayers).every(({ active }) => !!active);

	return (
		<>
			<ContentPanel
				mainActions={
					<button
						className="btn btn-sm btn-primary"
						onClick={() => {
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
						/>
					</div>
					<div className="form-control" style={{ maxWidth: "160px" }}>
						All active
					</div>
				</div>

				{vMixPlayers.map((vMixPlayer) => {
					const { ip, label, active } = vMixPlayer;

					return (
						<div className="input-group mb-1" key={`${ip}-${label}`}>
							<div className="input-group-text">
								<input
									className="form-check-input mt-0"
									type="radio"
									checked={active && !allActive}
									onChange={() => dispatch(setVMixPlayerActive(ip) as any)}
								/>
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{ip}
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{label}
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
						value={newVMixPlayer.ip}
						onChange={(event) =>
							setNewVMixPlayer({
								...newVMixPlayer,
								ip: event.target.value,
							})
						}
					/>
					<input
						type="text"
						className="form-control"
						style={{ maxWidth: "200px" }}
						placeholder="Label"
						aria-label="Label"
						value={newVMixPlayer.label}
						onChange={(event) =>
							setNewVMixPlayer({
								...newVMixPlayer,
								label: event.target.value,
							})
						}
					/>
					<button
						className="btn btn-outline-primary"
						type="button"
						onClick={() => {
							const newVMixPlayers: NewVMixPlayer[] = [
								...vMixPlayers.map(({ ip, label }) => ({ ip, label })),
								newVMixPlayer,
							];

							dispatch(initializeVMixPlayers(newVMixPlayers) as any);

							setNewVMixPlayer(INITIAL_NEW_VMIX_PLAYER);
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
