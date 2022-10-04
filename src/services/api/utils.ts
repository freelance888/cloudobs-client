import { HostAddress } from "../../store/slices/environment";
import store from "../../store/store";
import { buildUrl } from "../utils";
import { ApiResult } from "./types";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions<T> = {
	method?: RequestMethod;
	url: string;
	messages: {
		success: string;
		error: string;
	};
	data?: Record<string, unknown>;
	dataToReturn?: T;
};

export const getHostAddress = (): HostAddress => {
	return store.getState().environment.hostAddress;
};

export const sendRequest: <T extends {} = {}>(options: RequestOptions<T>) => Promise<ApiResult<T>> = async ({
	method = "GET",
	url,
	messages,
	data,
	dataToReturn,
}) => {
	const hostAddress = getHostAddress();

	console.debug(`-> ${method}`, url, hostAddress);

	const response = await fetch(`${buildUrl(hostAddress, url, data)}`, { method });

	return processResponse(response, messages, dataToReturn);
};

const processResponse = async <T extends {} = {}>(
	response: Response,
	messages: {
		success: string;
		error: string;
	},
	dataToReturn?: T
): Promise<ApiResult<T>> => {
	let data: T = {} as T;
	const { success } = messages;

	try {
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

export const createApiResult: <T>(data: T) => ApiResult<T> = (data) => {
	return {
		message: "",
		status: "success",
		data,
	};
};
