import { AnyAction, combineReducers, configureStore, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import { loggerMiddleware } from "./loggerMiddleware";

import app from "./slices/app";
import mediaSchedule from "./slices/media-schedule";
import environment from "./slices/environment";
import logs from "./slices/logs";
import { Selector } from "react-redux";

const rootReducer = combineReducers({
	app,
	mediaSchedule,
	environment,
	logs,
});

const store = configureStore({
	reducer: rootReducer,
	devTools: {
		name: "CloudOBS",
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppMiddleware = Middleware<null, RootState, AppDispatch>;
export type RootSelector<T> = Selector<RootState, T>;

export default store;
