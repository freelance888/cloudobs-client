import { Fragment } from "react";

import { useSelector } from "react-redux";

import { setInfrastructureLock, setInfrastructureUnlock } from "../services/socketApi";
import { selectRegistry } from "../store/slices/registry";

const InfrastructureLockButton = () => {
	const registry = useSelector(selectRegistry);
	const locked = registry.infrastructure_lock;

	return (
		<button
			className="infrastructure-lock-button btn"
			onClick={() => {
				if (locked) {
					if (window.confirm("❗️ Unlock the infrastructure?") === true) {
						setInfrastructureUnlock();
					}
				} else {
					if (window.confirm("Lock the infrastructure?") === true) {
						setInfrastructureLock();
					}
				}
			}}
		>
			{locked ? (
				<Fragment>
					<i className="bi bi-lock" />
					<span>Infrastructure locked</span>
				</Fragment>
			) : (
				<Fragment>
					<i className="bi bi-unlock" />
					<span>Infrastructure unlocked</span>
				</Fragment>
			)}
		</button>
	);
};

export default InfrastructureLockButton;
