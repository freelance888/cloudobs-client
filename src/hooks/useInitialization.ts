import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetchLanguagesSettings } from "../store/slices/app";
import { fetchVMixPlayers } from "../store/slices/environment";
import { AppDispatch } from "../store/store";

const useInitialization = (serverRunning: boolean) => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (serverRunning) {
			dispatch(fetchLanguagesSettings());
			dispatch(fetchVMixPlayers());
		}
	}, [dispatch, serverRunning]);
};

export default useInitialization;
