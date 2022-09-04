import { All, TransitionSettings } from "../types";
import { ApiCall } from "./types";
import { processResponse, sendRequest } from "./utils";

const API_URL_TRANSITION = "/transition";

/**
 * POST /transition
 * https://github.com/ALLATRA-IT/cloudobs/blob/master/api_docs.md#post-transition
 */
export const postTransition: ApiCall<All<TransitionSettings>, never> = (transitionSettings) => {
	const data = {
		transition_settings: transitionSettings,
	};

	return processResponse(sendRequest("POST", API_URL_TRANSITION, data), {
		success: "Transition complete",
		error: "Transition failed",
	});
};
