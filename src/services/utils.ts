import { HostAddress } from "../store/slices/environment";
import store from "../store/store";

export const buildHostBaseAddress = (hostAddress: HostAddress): string => {
	const { protocol, ipAddress, port, useLocalhost } = hostAddress;

	const hostname = useLocalhost ? window.location.hostname : ipAddress;
	return `${protocol}://${hostname}:${port}`;
};

export const buildUrl = (
	hostAddress: HostAddress,
	urlPath?: string,
	params?: Record<string, unknown>,
	dontJsonEncode?: boolean
) => {
	const baseAddress: string = buildHostBaseAddress(hostAddress);

	if (urlPath) {
		let queryString = "";

		if (params) {
			const queryParamsData: Record<string, string> = Object.keys(params).reduce((obj, key) => {
				if (dontJsonEncode) {
					obj[key] = params[key];
				} else {
					obj[key] = JSON.stringify(params[key]);
				}
				return obj;
			}, {});

			queryString = "?" + new URLSearchParams(queryParamsData).toString();
		}

		return new URL(`${urlPath}${queryString}`, baseAddress).toString();
	}

	return baseAddress;
};

const setUpTimeout = (timeoutMs: number = 8000): { signal: AbortSignal; clearTimeout: () => void } => {
	const controller = new AbortController();

	const id = setTimeout(() => controller.abort(), timeoutMs);

	return {
		signal: controller.signal,
		clearTimeout: () => clearTimeout(id),
	};
};

export const sendGetRequest: (url: string, timeoutMs?: number) => Promise<Response> = async (url, timeoutMs) => {
	const hostAddress = store.getState().environment.hostAddress;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> GET", url, hostAddress);

	const response = await fetch(`${buildUrl(hostAddress, url)}`, { signal });
	clearTimeout();
	return response;
};
export const sendPostRequest: (
	url: string,
	data?: Record<string, unknown>,
	timeoutMs?: number,
	dontJsonEncode?: boolean
) => Promise<Response> = async (url, data, timeoutMs, dontJsonEncode) => {
	const hostAddress = store.getState().environment.hostAddress;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> POST", url, data, hostAddress);

	const response = await fetch(`${buildUrl(hostAddress, url, data, dontJsonEncode)}`, {
		method: "POST",
		signal,
	});

	clearTimeout();

	return response;
};
