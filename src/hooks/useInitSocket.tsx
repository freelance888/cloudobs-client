import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../store/store";
import { initialize } from "../services/socketApi";
import { selectHostAddress } from "../store/slices/environment";

const useInitSocket = () => {
	const dispatch = useDispatch<AppDispatch>();
	const hostAddress = useSelector(selectHostAddress);

	useEffect(() => initialize(dispatch, hostAddress), []);
};

export default useInitSocket;
