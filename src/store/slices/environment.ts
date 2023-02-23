import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootSelector } from "../store";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
	useLocalhost: boolean;
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
	const DEFAULT_SERVER_IP = "65.109.13.24";

	// TODO uncomment this before merge to production
	// const port = window.location.port;
	// const SERVER_PORT: string = port === "3010" ? "5010" : "5000";
	const SERVER_PORT = "5010";

	return {
		protocol: "http",
		ipAddress: DEFAULT_SERVER_IP,
		port: SERVER_PORT,
		useLocalhost: false,
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
