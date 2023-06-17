import React, { useState } from "react";

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
		<div className="input-group mb-3">
			<input
				className="form-control"
				style={{ maxWidth: "160px" }}
				placeholder="Login"
				aria-label="Login"
				type="text"
				value={loginData.login}
				onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
			/>
			<input
				className="form-control"
				style={{ maxWidth: "160px" }}
				placeholder="Password"
				aria-label="Password"
				type="password"
				value={loginData.password}
				onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
			/>
			<button className="btn btn-secondary" type="button" onClick={handleLogin}>
				Login
			</button>
		</div>
	);
};

export default Login;
