import { Link, NavLink } from "react-router-dom";

import InfrastructureLockButton from "./InfrastructureLockButton";
import { useSelector } from "react-redux";
import { selectRegistry } from "../store/slices/registry";

export const URL_PATH_LIVE = "/";
export const URL_PATH_TIMING = "/timing";
export const URL_PATH_ENVIRONMENT = "/environment";
export const URL_PATH_LOGS = "/logs";

const NavigationBar: React.FC = () => {
	const registry = useSelector(selectRegistry);
	const vMixPlayers = registry?.vmix_players;
	const handleLogout = () => {
		const confirmLogout = window.confirm("Are you sure you want to logout?");
		if (confirmLogout) {
			localStorage.removeItem("cloud-obs-login");
			localStorage.removeItem("cloud-obs-password");
			window.location.reload();
		}
	};
	return (
		<nav className="navigation-bar navbar navbar-expand navbar-light bg-light m-auto">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<img src="images/cs-logo.svg" alt="" width="30" height="24" className="d-inline-block align-text-top" />
					<span className="ms-2">CloudOBS</span>
					<span className="cloudobs-navbar-version">v{window["APP_VERSION"]}</span>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerDemo02"
					aria-controls="navbarTogglerDemo02"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink className="nav-link" to={URL_PATH_LIVE}>
								🔴 Live
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to={URL_PATH_TIMING}>
								<i className="bi bi-clock-fill" />
								<span className="ml-2">Timing</span>
							</NavLink>
						</li>
						{vMixPlayers && (
							<li className="nav-item ms-auto">
								<NavLink className="nav-link" to={URL_PATH_ENVIRONMENT}>
									<i className="bi bi-diagram-2-fill" />
									<span className="ml-2">Environment</span>
								</NavLink>
							</li>
						)}
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to={URL_PATH_LOGS}>
								<i className="bi bi-code-slash" />
								<span className="ml-2">Logs</span>
							</NavLink>
						</li>
					</ul>
				</div>

				<InfrastructureLockButton />
				<button className="btn btn-secondary" onClick={handleLogout}>
					Logout
				</button>
			</div>
		</nav>
	);
};

export default NavigationBar;
