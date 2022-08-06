import { createSelector, createSlice, PayloadAction, Selector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type HostAddress = {
	protocol: string;
	ipAddress: string;
	port: string;
	useLocalhost: boolean;
};

export type VMixTriggerer = {
	id: string;
	ipAddress: string;
	active: boolean;
};

type AppState = {
	hostAddress: HostAddress;
	vMixTriggerers: VMixTriggerer[];
};

export const LS_KEY_HOST_ADDRESS = "cloudobs__host_address";

export const DEFAULT_HOST_ADDRESS: HostAddress = {
	protocol: "http",
	ipAddress: "0.0.0.0",
	port: "5000",
	useLocalhost: true,
};

const loadHostAddress = () => {
	const hostAddrSerialized = localStorage.getItem(LS_KEY_HOST_ADDRESS);
	const hostAddress: HostAddress = hostAddrSerialized ? JSON.parse(hostAddrSerialized) : DEFAULT_HOST_ADDRESS;
	return hostAddress;
};

const initialState: AppState = {
	hostAddress: loadHostAddress(),
	vMixTriggerers: [
		{
			id: "1",
			ipAddress: "0.0.1.0",
			active: false,
		},
		{
			id: "2",
			ipAddress: "0.0.2.0",
			active: false,
		},
	],
};

const { actions, reducer } = createSlice({
	name: "environment",
	initialState,
	reducers: {
		updateHostAddress(state, { payload }: PayloadAction<HostAddress>) {
			localStorage.setItem(LS_KEY_HOST_ADDRESS, JSON.stringify(payload));
			state.hostAddress = payload;
		},
		addVMixTriggerer(state, { payload }) {
			state.vMixTriggerers.push(payload);
		},
		removeVMixTriggerer(state, { payload }: PayloadAction<string>) {
			state.vMixTriggerers = state.vMixTriggerers.filter((triggerer) => triggerer.id !== payload);
		},
		setActiveVMixTriggerer(state, { payload }: PayloadAction<string>) {
			for (let i = 0; i < state.vMixTriggerers.length; i++) {
				if (state.vMixTriggerers[i].id === payload) {
					state.vMixTriggerers[i].active = true;
				} else {
					state.vMixTriggerers[i].active = false;
				}
			}
		},
	},
});

export const { updateHostAddress, addVMixTriggerer, removeVMixTriggerer, setActiveVMixTriggerer } = actions;

export const selectHostAddress: Selector<RootState, HostAddress> = ({ environment }) => environment.hostAddress;

export const selectVMixTriggerers: Selector<RootState, VMixTriggerer[]> = ({ environment }) =>
	environment.vMixTriggerers;

export const selectVMixTriggerer: (triggererId: string) => Selector<RootState, VMixTriggerer | null> = (triggererId) =>
	createSelector(
		(state: RootState) => state.environment.vMixTriggerers,
		(vMixTriggerers) => vMixTriggerers.find((triggerer) => triggerer.id === triggererId) ?? null
	);

export default reducer;
