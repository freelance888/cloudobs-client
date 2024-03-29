import { AnyAction, combineReducers, configureStore, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import { Selector } from "react-redux";

import app from "./slices/app";
import environment from "./slices/environment";
import logs from "./slices/logs";
import registry from "./slices/registry";

const rootReducer = combineReducers({
	app,
	environment,
	logs,
	registry,
});

const store = configureStore({
	reducer: rootReducer,
	devTools: {
		name: "CloudOBS",
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppMiddleware = Middleware<null, RootState, AppDispatch>;
export type RootSelector<T> = Selector<RootState, T>;

export default store;
