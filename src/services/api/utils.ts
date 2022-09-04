import { HostAddress } from "../../store/slices/environment";
import store from "../../store/store";
import { buildUrl } from "../utils";
import { ApiResult } from "./types";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const getHostAddress = (): HostAddress => {
	return store.getState().environment.hostAddress;
};

export const sendRequest: (
	method: RequestMethod,
	url: string,
	data?: Record<string, unknown>
) => Promise<Response> = async (method, url, data) => {
	const hostAddress = getHostAddress();

	console.debug(`-> ${method}`, url, hostAddress);

	return await fetch(`${buildUrl(hostAddress, url, data)}`, { method });
};

export const processResponse = async <T extends {} = {}>(
	responsePromise: Promise<Response>,
	messages: {
		success: string;
		error: string;
	},
	dataToReturn?: T
): Promise<ApiResult<T>> => {
	let data: T = {} as T;
	const { success } = messages;

	try {
		const response = await responsePromise;

		// Failed request
		if (!response.status) {
			const message = (response as any).message;
			return { status: "error", message };
		}
		// Successful request
		else if (response.status === 200) {
			try {
				data = await response.json();
			} catch (error) {}
			return { status: "success", message: success, data: dataToReturn ?? data };
		}
		// Error response
		else {
			const message = await response.text();
			return { status: "error", message };
		}
	} catch (error) {
		return { status: "error", message: String(error) };
	}
};
