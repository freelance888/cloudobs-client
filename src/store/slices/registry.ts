import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Registry } from "../../services/types";
import { RootSelector } from "../store";

type RegistryState = {
	loaded: boolean;
	data: Registry | null;
};

const initialState: RegistryState = {
	loaded: false,
	data: null,
};

const { actions, reducer } = createSlice({
	name: "registry",
	initialState,
	reducers: {
		setRegistry(state, { payload }: PayloadAction<Registry>) {
			state.loaded = true;
			state.data = payload;
		},
		updateRegistry(state, { payload }: PayloadAction<Partial<Registry>>) {
			if (state.loaded) {
				state.data = { ...(state.data as Registry), ...payload };
			}
		},
	},
});

export const { setRegistry, updateRegistry } = actions;

export const selectIsRegistryLoaded: RootSelector<boolean> = ({ registry }) => registry.loaded;

export const selectRegistry: RootSelector<Registry> = ({ registry }) => registry.data as Registry;

export default reducer;
