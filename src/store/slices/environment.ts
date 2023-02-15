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

const getDefaultHostAddress: () => HostAddress = () => {
	const DEFAULT_SERVER_IP = "65.109.13.24";

	const { port } = window.location;
	const SERVER_PORT = port === "3010" ? "5010" : "5000";

	return {
		protocol: "http",
		ipAddress: DEFAULT_SERVER_IP,
		port: SERVER_PORT,
		useLocalhost: false,
	};
};

const loadHostAddress = () => {
	const hostAddrSerialized = localStorage.getItem(LS_KEY_HOST_ADDRESS);
	const hostAddress: HostAddress = hostAddrSerialized ? JSON.parse(hostAddrSerialized) : getDefaultHostAddress();
	return hostAddress;
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
