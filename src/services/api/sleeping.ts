import { buildUrl } from "../utils";
import { getHostAddress } from "./utils";

const SERVER_SLEEPING_TEXT = "The server is sleeping :) Tell the admin to wake it up.";
const SERVER_SLEEPING_ENDPOINT = "/info";

export const isServerSleeping: () => Promise<boolean> = async () => {
	let isSleeping = false;

	const url = buildUrl(getHostAddress(), SERVER_SLEEPING_ENDPOINT);

	const r = await fetch(url);

	try {
		const responseAsText = await r.text();
		if (responseAsText === SERVER_SLEEPING_TEXT) {
			isSleeping = true;
		}
	} catch (e) {}

	return isSleeping;
};
