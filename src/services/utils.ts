import { HostAddress } from "../store/slices/app";
import store from "../store/store";

export const buildUrl = (hostAddress: HostAddress, urlPath?: string, params?: string) => {
	const { protocol, ipAddress, port } = hostAddress;
	return `${protocol}://${ipAddress}:${port}${urlPath || ""}${params || ""}`;
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
	const hostAddress = store.getState().app.hostAddress;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> GET", url, hostAddress);

	const response = await fetch(`${buildUrl(hostAddress, url)}`, { signal });
	clearTimeout();
	return response;
};
export const sendPostRequest: (
	url: string,
	data?: Record<string, unknown>,
	timeoutMs?: number
) => Promise<Response> = async (url, data, timeoutMs) => {
	const hostAddress = store.getState().app.hostAddress;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> POST", url, data, hostAddress);

	let params = "";
	if (data) {
		const key = Object.keys(data)?.[0];
		params = `?${key}=${JSON.stringify(data[key])}`;
	}

	const response = await fetch(`${buildUrl(hostAddress, url, params)}`, {
		method: "POST",
		signal,
	});

	clearTimeout();

	return response;
};
