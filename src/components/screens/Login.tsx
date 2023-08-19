import React, { useState } from "react";
import ContentPanel from "../ContentPanel";

const Login: React.FC = () => {
	const [loginData, setLoginData] = useState({
		login: localStorage.getItem("cloud-obs-login") || "",
		password: localStorage.getItem("cloud-obs-password") || "",
	});

	const handleLogin = () => {
		console.log("### LOGIN", loginData.login);
		localStorage.setItem("cloud-obs-login", loginData.login);
		localStorage.setItem("cloud-obs-password", loginData.password);
		window.location.reload();
	};

	return (
		<ContentPanel
			mainActions={
				<button className="btn btn-success" type="button" onClick={handleLogin}>
					Login
				</button>
			}
		>
			<h3>Enter credentials</h3>
			<label htmlFor="login" className="form-label">
				Login
			</label>
			<input
				className="form-control"
				id="login"
				style={{ maxWidth: "320px", marginBottom: "10px" }}
				aria-label="Login"
				type="text"
				value={loginData.login}
				onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
			/>
			<label htmlFor="password" className="form-label">
				Password
			</label>
			<input
				id="password"
				className="form-control"
				style={{ maxWidth: "320px" }}
				aria-label="Password"
				type="password"
				value={loginData.password}
				onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
			/>
		</ContentPanel>
	);
};

export default Login;
