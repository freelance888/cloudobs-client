import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchLanguagesSettings } from "../store/slices/app";
import { fetchVMixPlayers } from "../store/slices/environment";

const useInitialization = (serverRunning: boolean) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (serverRunning) {
			dispatch(fetchLanguagesSettings() as any);
			dispatch(fetchVMixPlayers() as any);
		}
	}, [dispatch, serverRunning]);
};

export default useInitialization;
