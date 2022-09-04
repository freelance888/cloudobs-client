import { Link, NavLink } from "react-router-dom";

const NavigationBar: React.FC = () => {
	return (
		<nav className="navigation-bar navbar navbar-expand-lg navbar-light bg-light">
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
							<NavLink className="nav-link" to="/">
								🔴 Live
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/settings">
								<i className="bi bi-gear-fill" />
								<span className="ml-2">Initialization</span>
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/videos">
								<i className="bi bi-clock-fill" />
								<span className="ml-2">Video schedule</span>
							</NavLink>
						</li>
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to="/environment">
								<i className="bi bi-diagram-2-fill" />
								<span className="ml-2">Environment</span>
							</NavLink>
						</li>
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to="/logs">
								<i className="bi bi-code-slash" />
								<span className="ml-2">Logs</span>
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavigationBar;
