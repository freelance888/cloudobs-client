import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Registry } from "../../services/types";
import { RootSelector } from "../store";

type RegistryState = {
	registry: Registry | null;
};

const initialState: RegistryState = {
	registry: null,
};

const { actions, reducer } = createSlice({
	name: "registry",
	initialState,
	reducers: {
		updateRegistry(state, { payload }: PayloadAction<Registry>) {
			state.registry = payload;
		},
	},
});

export const { updateRegistry } = actions;

export const selectRegistry: RootSelector<Registry> = ({ registry }) => registry.registry as Registry;

export default reducer;
