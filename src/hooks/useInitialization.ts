import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchLanguagesSettings } from "../store/slices/app";
import { fetchVMixPlayers } from "../store/slices/environment";

const useInitialization = (serverReady: boolean) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (serverReady) {
			dispatch(fetchLanguagesSettings() as any);
			dispatch(fetchVMixPlayers() as any);
		}
	}, [dispatch, serverReady]);
};

export default useInitialization;
