import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../store/store";
import { initialize } from "../services/socketApi";
import { selectHostAddress } from "../store/slices/environment";

const useInitSocket = () => {
	const dispatch = useDispatch<AppDispatch>();
	const hostAddress = useSelector(selectHostAddress);
	const login = localStorage.getItem("cloud-obs-login");
	const password = localStorage.getItem("cloud-obs-password");
	useEffect(() => initialize(dispatch, hostAddress, login, password), [hostAddress, login, password]);
};

export default useInitSocket;
