import { HostAddress } from "../store/slices/environment";

import { buildHostBaseAddress, buildUrl } from "./utils";

describe("buildHostBaseAddress", () => {
	it("useLocalhost = false", () => {
		const hostAddress: HostAddress = {
			protocol: "proto",
			ipAddress: "123.456.789.0",
			port: "9999",
			useLocalhost: false,
		};

		expect(buildHostBaseAddress(hostAddress)).toBe("proto://123.456.789.0:9999");
	});

	it("useLocalhost = true", () => {
		const hostAddress: HostAddress = {
			protocol: "proto",
			ipAddress: "123.456.789.0",
			port: "9999",
			useLocalhost: true,
		};

		// @ts-ignore
		delete window.location;
		// @ts-ignore
		global.window.location = new URL("https://test-localhost.com");

		expect(buildHostBaseAddress(hostAddress)).toBe("proto://test-localhost.com:9999");
	});
});

describe("buildUrl", () => {
	it("urlPath empty", () => {
		const hostAddress: HostAddress = {
			protocol: "protocol",
			ipAddress: "101.010.101.0",
			port: "1010",
			useLocalhost: false,
		};

		expect(buildUrl(hostAddress)).toBe("protocol://101.010.101.0:1010");
	});

	it("urlPath set and params empty", () => {
		const hostAddress: HostAddress = {
			protocol: "protocol",
			ipAddress: "1.1.1.1",
			port: "1111",
			useLocalhost: false,
		};

		expect(buildUrl(hostAddress, "")).toBe("protocol://1.1.1.1:1111");
		expect(buildUrl(hostAddress, "test-path")).toBe("protocol://1.1.1.1:1111/test-path");
	});

	describe("urlPath set and params set", () => {
		const hostAddress: HostAddress = {
			protocol: "protocol",
			ipAddress: "1.1.1.1",
			port: "1111",
			useLocalhost: false,
		};

		it("simple params (non-objects)", () => {
			expect(buildUrl(hostAddress, "test-path", { simple: 2 })).toBe("protocol://1.1.1.1:1111/test-path?simple=2");
			expect(buildUrl(hostAddress, "test-path", { simple: 2, other: "val" })).toBe(
				"protocol://1.1.1.1:1111/test-path?simple=2&other=val"
			);
		});

		it("complex params (objects)", () => {
			const url = buildUrl(hostAddress, "test-path", {
				complex: {
					key1: "val1",
					key2: {
						nested1: "nestedVal1",
						nested2: 22,
					},
				},
			});

			const expectedUrl =
				"protocol://1.1.1.1:1111/test-path?complex=%7B%22key1%22%3A%22val1%22%2C%22key2%22%3A%7B%22nested1%22%3A%22nestedVal1%22%2C%22nested2%22%3A22%7D%7D";

			expect(url).toBe(expectedUrl);
		});
	});
});
