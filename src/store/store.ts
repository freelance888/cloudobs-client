import { combineReducers, configureStore } from "@reduxjs/toolkit";

import app from "./slices/app";

const rootReducer = combineReducers({
	app,
});

const store = configureStore({
	reducer: rootReducer,
	devTools: {
		name: "CloudOBS",
	},
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
