import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootSelector, RootState } from "../store";
import { NewVMixPlayer, VMixPlayer } from "../../services/types";
import { dispose, vmixPlayersAdd, vmixSetActive } from "../../services/soketApi";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
	useLocalhost: boolean;
};

type EnvironmentState = {
	hostAddress: HostAddress;
	vMixPlayers: VMixPlayer[];
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

// export const fetchVMixPlayers: AsyncThunk<ApiResult<VMixPlayer[]>, void, { state: RootState }> = createAsyncThunk<
// 	ApiResult<VMixPlayer[]>,
// 	void,
// 	{ state: RootState }
// >("environment/fetchVMixPlayers", async (_, { rejectWithValue }) => {
// 	const result = await ApiService.getVMixPlayers();
// 	//in registry
//
// 	if (result.status === "error") {
// 		return rejectWithValue(result.message);
// 	}
//
// 	return result;
// });

export const initializeVMixPlayers: AsyncThunk<void, NewVMixPlayer[], { state: RootState }> = createAsyncThunk<
	void,
	NewVMixPlayer[],
	{ state: RootState }
>("environment/initializeVMixPlayers", async (vMixPlayers) => {
	// also we have {'*': {'name': 'All', 'active': True}} case
	vMixPlayers.forEach((player) => {
		vmixPlayersAdd(player.ip, player.name);
	});
});

export const setVMixPlayerActive: AsyncThunk<void, string, { state: RootState }> = createAsyncThunk<
	void,
	string,
	{ state: RootState }
>("environment/setVMixPlayerActive", async (vMixPlayer) => {
	vmixSetActive(vMixPlayer);
});

export const deleteMinions: AsyncThunk<void, void, { state: RootState }> = createAsyncThunk<
	void,
	void,
	{ state: RootState }
>("environment/deleteMinions", async () => {
	dispose(); // clear up and delete minions
});

const initialState: EnvironmentState = {
	hostAddress: loadHostAddress(),
	vMixPlayers: [],
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
