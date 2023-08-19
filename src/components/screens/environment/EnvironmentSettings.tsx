import { useState } from "react";

import { useSelector } from "react-redux";

import ContentPanel from "../../ContentPanel";
import { selectRegistry } from "../../../store/slices/registry";
import { dispose, vmixPlayersAdd, vmixPlayersRemove, vmixPlayersSetActive } from "../../../services/socketApi";
import HostAddressSelection from "../HostAddressSelection";

type NewVMixPlayer = { ip: string; name: string };

const EnvironmentSettings: React.FC = () => {
	const registry = useSelector(selectRegistry);
	const vMixPlayers = registry?.vmix_players || {};
	const activeVMixPlayer = registry?.active_vmix_player;
	const [newVMixPlayer, setNewVMixPlayer] = useState<NewVMixPlayer>({ ip: "", name: "" });

	return (
		<>
			<ContentPanel>
				<label htmlFor="server-ip" className="form-label">
					Clean up server data:
				</label>
				<div>
					<button
						className="btn btn-sm btn-primary"
						onClick={() => {
							if (window.confirm("❗️ You are going to delete all minion servers") === true) {
								if (window.confirm("Are you really sure? 🙂") === true) {
									dispose();
								}
							}
						}}
					>
						<i className={"bi bi-trash-fill"} />
						<span>Delete minions</span>
					</button>
				</div>
			</ContentPanel>
			<HostAddressSelection />
			<ContentPanel>
				<label htmlFor="vmix-triggerers" className="form-label">
					vMix players
				</label>

				{Object.entries(vMixPlayers).map(([ip, { name }]) => {
					return (
						<div className="input-group mb-1" key={`${ip}-${name}`}>
							<div className="input-group-text">
								<input
									className="form-check-input mt-0"
									type="radio"
									checked={activeVMixPlayer === ip}
									onChange={() => vmixPlayersSetActive(name)}
								/>
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{ip}
							</div>
							<div className="form-control" style={{ maxWidth: "160px" }}>
								{name.toUpperCase()}
							</div>
							{ip !== "*" && (
								<button
									className="btn btn-sm btn-outline-primary"
									onClick={() => {
										if (window.confirm("❗️ Are you sure to remove vMix player?") === true) {
											vmixPlayersRemove(ip, name);
										}
									}}
								>
									Remove
								</button>
							)}
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
						value={newVMixPlayer.name}
						onChange={(event) =>
							setNewVMixPlayer({
								...newVMixPlayer,
								name: event.target.value,
							})
						}
					/>
					<button
						className="btn btn-outline-primary"
						type="button"
						onClick={() => {
							const { ip, name } = newVMixPlayer;
							vmixPlayersAdd(ip, name);
							setNewVMixPlayer({ ip: "", name: "" });
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
