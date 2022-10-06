import { buildUrl } from "../utils";
import { getHostAddress } from "./utils";

const SERVER_SLEEPING_TEXT = "The server is sleeping :) Tell the admin to wake it up.";
const SERVER_NOT_INITIALIZED_TEXT = "/ is not allowed before initialization";
// const SERVER_SLEEPING_ENDPOINT = "/info";

export const isServerSleeping: () => Promise<boolean> = async () => {
	let isSleeping = false;

	const url = buildUrl(getHostAddress(), "");

	const r = await fetch(url);

	try {
		const responseAsText = await r.text();

		if (responseAsText === SERVER_NOT_INITIALIZED_TEXT) {
			isSleeping = true;
		} else if (responseAsText === SERVER_SLEEPING_TEXT) {
			isSleeping = true;
		} else if (responseAsText.includes("Cannot connect to host")) {
			isSleeping = true;
		}
	} catch (e) {}

	return isSleeping;
};
