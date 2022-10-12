import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as ApiService from "../../services/api/index";
import { RootSelector, RootState } from "../store";
import { NewVMixPlayer, VMixPlayer } from "../../services/types";
import { ApiResult } from "../../services/api/types";

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

	const { hostname, port } = window.location;
	const SERVER_PORT = hostname === "localhost" || port === "3010" ? "5010" : "5000";

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

export const fetchVMixPlayers: AsyncThunk<ApiResult<VMixPlayer[]>, void, { state: RootState }> = createAsyncThunk<
	ApiResult<VMixPlayer[]>,
	void,
	{ state: RootState }
>("environment/fetchVMixPlayers", async (_, { rejectWithValue }) => {
	const result = await ApiService.getVMixPlayers();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
});

export const initializeVMixPlayers: AsyncThunk<ApiResult, NewVMixPlayer[], { state: RootState }> = createAsyncThunk<
	ApiResult,
	NewVMixPlayer[],
	{ state: RootState }
>("environment/initializeVMixPlayers", async (vMixPlayers, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postVMixPlayers(vMixPlayers);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchVMixPlayers());

	return result;
});

export const fetchVMixPlayerActive: AsyncThunk<ApiResult<string>, void, { state: RootState }> = createAsyncThunk<
	ApiResult<string>,
	void,
	{ state: RootState }
>("environment/fetchVMixPlayerActive", async (_, { rejectWithValue }) => {
	const result = await ApiService.getVMixPlayersActive();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
});

export const setVMixPlayerActive: AsyncThunk<ApiResult, string, { state: RootState }> = createAsyncThunk<
	ApiResult,
	string,
	{ state: RootState }
>("environment/setVMixPlayerActive", async (vMixPlayer, { dispatch, rejectWithValue }) => {
	const result = await ApiService.postVMixPlayersActive(vMixPlayer);

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	dispatch(fetchVMixPlayers());

	return result;
});

export const deleteMinions: AsyncThunk<ApiResult, void, { state: RootState }> = createAsyncThunk<
	ApiResult,
	void,
	{ state: RootState }
>("environment/deleteMinions", async (_, { rejectWithValue }) => {
	const result = await ApiService.postMinionsDeleteVms();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
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
	extraReducers: (builder) => {
		builder.addCase(fetchVMixPlayers.fulfilled, (state, { payload }) => {
			const fetchedVMixPlayers = payload.data as VMixPlayer[];
			state.vMixPlayers = fetchedVMixPlayers;
		});
	},
});

export const { updateHostAddress } = actions;

export const selectHostAddress: RootSelector<HostAddress> = ({ environment }) => environment.hostAddress;

export const selectVMixPlayers: RootSelector<VMixPlayer[]> = ({ environment }) => environment.vMixPlayers;

export default reducer;
