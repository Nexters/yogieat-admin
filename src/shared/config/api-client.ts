import { buildApiUrl } from "./api";

const JSON_CONTENT_TYPE = "application/json";

type RequestJsonOptions = Omit<RequestInit, "body" | "headers" | "method"> & {
	body?: unknown;
	headers?: Record<string, string>;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export class ApiError extends Error {
	status: number;
	code?: string;

	constructor(message: string, status: number, code?: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

const toHeaders = (
	headers?: Record<string, string>,
): Record<string, string> => {
	return {
		Accept: JSON_CONTENT_TYPE,
		...headers,
	};
};

const parseResponse = async <T>(response: Response): Promise<T> => {
	if (response.status === 204) {
		return undefined as T;
	}

	const contentType = response.headers.get("content-type") ?? "";
	const isJson = contentType.includes(JSON_CONTENT_TYPE);
	const payload = isJson
		? ((await response.json()) as unknown)
		: await response.text();

	if (!response.ok) {
		if (
			payload &&
			typeof payload === "object" &&
			"message" in payload &&
			typeof payload.message === "string"
		) {
			throw new ApiError(
				payload.message,
				response.status,
				"code" in payload && typeof payload.code === "string"
					? payload.code
					: undefined,
			);
		}

		throw new ApiError(
			typeof payload === "string" && payload.trim()
				? payload
				: `요청이 실패했습니다. (${response.status})`,
			response.status,
		);
	}

	return payload as T;
};

export const requestJson = async <T>(
	path: string,
	options: RequestJsonOptions = {},
): Promise<T> => {
	const { body, headers, method = "GET", ...rest } = options;
	const hasBody = typeof body !== "undefined";
	const requestHeaders = toHeaders(headers);

	if (hasBody) {
		requestHeaders["Content-Type"] = JSON_CONTENT_TYPE;
	}

	const response = await fetch(buildApiUrl(path), {
		method,
		headers: requestHeaders,
		body: hasBody ? JSON.stringify(body) : undefined,
		...rest,
	});

	return parseResponse<T>(response);
};
