import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, Selector } from "@reduxjs/toolkit";
import { ApiResult } from "../../services/api";
import * as ApiService from "../../services/api";
import { RootState } from "../store";
import { VMixPlayers } from "../../services/types";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
	useLocalhost: boolean;
};

type AppState = {
	hostAddress: HostAddress;
	vMixPlayers: VMixPlayers;
};

export const LS_KEY_HOST_ADDRESS = "cloudobs__host_address";

export const DEFAULT_HOST_ADDRESS: HostAddress = {
	protocol: "http",
	ipAddress: window.location.hostname,
	port: "5000",
	useLocalhost: true,
};

const loadHostAddress = () => {
	const hostAddrSerialized = localStorage.getItem(LS_KEY_HOST_ADDRESS);
	const hostAddress: HostAddress = hostAddrSerialized ? JSON.parse(hostAddrSerialized) : DEFAULT_HOST_ADDRESS;
	return hostAddress;
};

export const fetchVMixPlayers: AsyncThunk<ApiResult<VMixPlayers>, void, { state: RootState }> = createAsyncThunk<
	ApiResult<VMixPlayers>,
	void,
	{ state: RootState }
>("environment/fetchVMixPlayers", async (_, { rejectWithValue }) => {
	const result = await ApiService.getVMixPlayers();

	if (result.status === "error") {
		return rejectWithValue(result.message);
	}

	return result;
});

export const initializeVMixPlayers: AsyncThunk<ApiResult, string[], { state: RootState }> = createAsyncThunk<
	ApiResult,
	string[],
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

const initialState: AppState = {
	hostAddress: loadHostAddress(),
	vMixPlayers: {},
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
			const fetchedVMixPlayers = payload.data as VMixPlayers;
			state.vMixPlayers = fetchedVMixPlayers;
		});
	},
});

export const { updateHostAddress } = actions;

export const selectHostAddress: Selector<RootState, HostAddress> = ({ environment }) => environment.hostAddress;

export const selectVMixPlayers: Selector<RootState, VMixPlayers> = ({ environment }) => environment.vMixPlayers;

export default reducer;
