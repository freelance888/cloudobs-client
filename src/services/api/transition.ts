import { All, TransitionSettings } from "../types";
import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_TRANSITION = "/transition";

/**
 * POST /transition
 * https://github.com/ALLATRA-IT/cloudobs/blob/main/api_docs.md#post-transition
 */
export const postTransition: ApiCall<All<Partial<TransitionSettings>>> = (transitionSettings) => {
	const data = {
		transition_settings: transitionSettings,
	};

	return sendRequest({
		method: "POST",
		url: API_URL_TRANSITION,
		data,
		messages: {
			success: "Transition set",
			error: "Transition setting failed",
		},
		dataToReturn: transitionSettings,
	});
};
