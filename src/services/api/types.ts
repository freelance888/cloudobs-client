export type ApiResult<T = {}> = {
	status: "success" | "error";
	message: string;
	data?: T;
};

export type ApiCall<T extends Record<string, unknown> | unknown[] | string | (1 | 0) | void, U = T> = (
	param: T
) => Promise<ApiResult<U>>;
