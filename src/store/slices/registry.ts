import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Registry } from "../../services/types";
import { RootSelector } from "../store";

type RegistryState = {
	data: Registry | null;
};

const initialState: RegistryState = {
	data: null,
};

const { actions, reducer } = createSlice({
	name: "registry",
	initialState,
	reducers: {
		updateRegistry(state, { payload }: PayloadAction<Registry>) {
			state.data = { ...state.data, ...payload };
		},
	},
});

export const { updateRegistry } = actions;

export const selectRegistry: RootSelector<Registry> = ({ registry }) => registry.data as Registry;

export default reducer;
