import { Link, NavLink } from "react-router-dom";

export const URL_PATH_LIVE = "/";
export const URL_PATH_VIDEOS = "/videos";
export const URL_PATH_ENVIRONMENT = "/environment";
export const URL_PATH_LOGS = "/logs";
export const STREAM_CHECK = "/stream-check";

const NavigationBar: React.FC = () => {
	return (
		<nav className="navigation-bar navbar navbar-expand navbar-light bg-light">
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
							<NavLink className="nav-link" to={URL_PATH_VIDEOS}>
								<i className="bi bi-clock-fill" />
								<span className="ml-2">Videos</span>
							</NavLink>
						</li>
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to={URL_PATH_ENVIRONMENT}>
								<i className="bi bi-diagram-2-fill" />
								<span className="ml-2">Environment</span>
							</NavLink>
						</li>
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to={URL_PATH_LOGS}>
								<i className="bi bi-code-slash" />
								<span className="ml-2">Logs</span>
							</NavLink>
						</li>
						<li className="nav-item ms-auto">
							<NavLink className="nav-link" to={STREAM_CHECK}>
								<i className="bi bi-check2-circle" />
								<span className="ml-2">Stream Check</span>
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavigationBar;
