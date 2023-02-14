import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "../store/store";
import { updateRegistry } from "../store/slices/app";
import { getInfo, pullConfig, socket } from "../services/soketApi";
import { InfoResponse } from "../services/types";

const useInitSocket = () => {
	const dispatch = useDispatch<AppDispatch>();

	const init = () => {
		socket.on("connect", () => {
			getInfo(dispatch);
			pullConfig();
			getInfo(dispatch);
			socket.on("on registry change", (data: InfoResponse) => {
				console.log("on registry change", data);
				if (data.result && data.serializable_object) {
					dispatch(updateRegistry(JSON.stringify(data?.serializable_object?.registry)));
				}
			});
		});
	};

	useEffect(() => {
		init();

		return () => {
			socket.disconnect();
		};
	}, []);
};
export default useInitSocket;
