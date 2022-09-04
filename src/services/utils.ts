import { HostAddress } from "../store/slices/environment";

export const buildHostBaseAddress = (hostAddress: HostAddress): string => {
	const { protocol, ipAddress, port, useLocalhost } = hostAddress;

	const hostname = useLocalhost ? window.location.hostname : ipAddress;
	return `${protocol}://${hostname}:${port}`;
};

export const buildUrl = (hostAddress: HostAddress, urlPath?: string, params?: Record<string, unknown>) => {
	const baseAddress: string = buildHostBaseAddress(hostAddress);

	if (urlPath) {
		let queryString = "";

		if (params) {
			const queryParamsData: Record<string, string> = Object.keys(params).reduce((obj, key) => {
				if (typeof params[key] === "object") {
					obj[key] = JSON.stringify(params[key]);
				} else {
					obj[key] = params[key];
				}
				return obj;
			}, {});

			queryString = "?" + new URLSearchParams(queryParamsData).toString();
		}

		return new URL(`${urlPath}${queryString}`, baseAddress).toString();
	}

	return baseAddress;
};
