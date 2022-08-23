import { sendGetRequest } from "./utils";

const API_URL_HEALTH_CHECK = "/healthcheck";
const RESPONSE_SERVER_SLEEPING = "The server is sleeping :) Tell the admin to wake it up.";

export enum HealthCheck {
	Ready = "Ready",
	Sleeping = "Sleeping",
}

export const healthCheck = async (): Promise<HealthCheck> => {
	return new Promise(async (resolve, reject) => {
		const response = await sendGetRequest(API_URL_HEALTH_CHECK);
		const text = await response.text();

		if (text === RESPONSE_SERVER_SLEEPING) {
			return reject(HealthCheck.Sleeping);
		}

		return resolve(HealthCheck.Ready);
	});
};
