import { ApiCall } from "./types";
import { sendRequest } from "./utils";

const API_URL_MINIONS_DELETE_VMS = "/minions/delete_vms";

/**
 * DELETE /minions/delete_vms
 */
export const deleteMinionsDeleteVms: ApiCall<void, never> = () => {
	return sendRequest({
		method: "DELETE",
		url: API_URL_MINIONS_DELETE_VMS,
		messages: {
			success: "Minions deleted",
			error: "Minions deleting failed",
		},
	});
};
