import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "../store/store";
import { subscribe } from "../services/socketApi";

const useInitSocket = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => subscribe(dispatch), []);
};

export default useInitSocket;
