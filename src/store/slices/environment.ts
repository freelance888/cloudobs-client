import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootSelector } from "../store";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
	useLocalhost: boolean;
	login: string;
	password: string;
};

type EnvironmentState = {
	hostAddress: HostAddress;
};

export const LS_KEY_HOST_ADDRESS = "cloudobs__host_address";

export const buildUrlFromHostAddress = (hostAddress: HostAddress) => {
	const { protocol, ipAddress, port } = hostAddress;
	return `${protocol}://${ipAddress}:${port}`;
};

const getDefaultHostAddress = (): HostAddress => {
	const DEFAULT_SERVER_IP = window.location.hostname;
	const CURRENT_PORT = window.location.port;

	const BACKEND_PORT: string = ["3010", "8080"].includes(CURRENT_PORT) ? "5010" : "5000";

	return {
		protocol: "http",
		ipAddress: DEFAULT_SERVER_IP,
		port: BACKEND_PORT,
		useLocalhost: false,
		login: "",
		password: "",
	};
};

const loadHostAddress = (): HostAddress => {
	const hostAddrSerialized = localStorage.getItem(LS_KEY_HOST_ADDRESS);
	return hostAddrSerialized ? JSON.parse(hostAddrSerialized) : getDefaultHostAddress();
};

const initialState: EnvironmentState = {
	hostAddress: loadHostAddress(),
};

const { actions, reducer } = createSlice({
	name: "environment",
	initialState,
	reducers: {
		updateHostAddress(state, { payload }: PayloadAction<HostAddress>) {
			localStorage.setItem(LS_KEY_HOST_ADDRESS, JSON.stringify(payload));
			state.hostAddress = payload;
		},
	},
});

export const { updateHostAddress } = actions;

export const selectHostAddress: RootSelector<HostAddress> = ({ environment }) => environment.hostAddress;

export default reducer;
