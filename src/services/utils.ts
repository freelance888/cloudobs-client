import { ServerUrl, updateStatus } from "../store/slices/app";
import store, { AppDispatch } from "../store/store";

export const buildUrl = (serverUrl: ServerUrl, urlPath?: string, params?: string) => {
	const { protocol, ipAddress, port } = serverUrl;
	return `${protocol}://${ipAddress}:${port}/${urlPath || ""}${params || ""}`;
};

const dispatchErrorStatus = (dispatch: AppDispatch) => {
	dispatch(updateStatus({ type: "error", message: "Server URL is not set." }));
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
	const serverUrl = store.getState().app.serverUrl;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> GET", url, serverUrl);

	if (!serverUrl) {
		dispatchErrorStatus(store.dispatch);
		return Promise.reject();
	} else {
		const response = await fetch(`${buildUrl(serverUrl, url)}`, { signal });
		clearTimeout();
		return response;
	}
};
export const sendPostRequest: (
	url: string,
	data?: Record<string, unknown>,
	timeoutMs?: number
) => Promise<Response> = async (url, data, timeoutMs) => {
	const serverUrl = store.getState().app.serverUrl;
	const { signal, clearTimeout } = setUpTimeout(timeoutMs);

	console.debug("-> POST", url, data, serverUrl);

	if (!serverUrl) {
		dispatchErrorStatus(store.dispatch);
		return Promise.reject();
	} else {
		let params = "";
		if (data) {
			const key = Object.keys(data)?.[0];
			params = `?${key}=${JSON.stringify(data[key])}`;
		}

		const response = await fetch(`${buildUrl(serverUrl, url, params)}`, {
			method: "POST",
			signal,
		});

		clearTimeout();

		return response;
	}
};
