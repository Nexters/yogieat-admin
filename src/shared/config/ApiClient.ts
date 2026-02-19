import { buildApiUrl } from "#/shared/config/api";
import { ERROR_MESSAGE_BY_CODE } from "#/shared/constants";

const JSON_CONTENT_TYPE = "application/json";

export type ApiResponse<T> = {
	status: number;
	data: T;
	timestamp: string;
	code?: string;
};

export type ApiResponsePayload<T> =
	| T
	| ApiResponse<T>
	| {
			data: T;
	  };

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

type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const toHeaders = (
	headers?: Record<string, string>,
): Record<string, string> => {
	return {
		Accept: JSON_CONTENT_TYPE,
		...headers,
	};
};

const toErrorText = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		const message = value.trim();
		return message ? message : undefined;
	}

	return undefined;
};

const readNestedData = (payload: UnknownRecord): UnknownRecord | undefined => {
	const nested = payload.data;
	if (isRecord(nested)) {
		return nested;
	}

	return undefined;
};

const resolveErrorMessageAndCode = (
	payload: UnknownRecord,
): { message: string; code?: string } | undefined => {
	const primary = toErrorText(payload.message);
	const nested = readNestedData(payload);
	const nestedMessage = nested ? toErrorText(nested.message) : undefined;
	const nestedCode =
		toErrorText(nested?.errorCode) ??
		toErrorText(nested?.code) ??
		toErrorText(payload.errorCode) ??
		toErrorText(payload.code);
	const messageByCode =
		nestedCode && nestedCode in ERROR_MESSAGE_BY_CODE
			? ERROR_MESSAGE_BY_CODE[nestedCode as keyof typeof ERROR_MESSAGE_BY_CODE]
			: undefined;
	const message =
		nestedMessage ||
		primary ||
		messageByCode;

	if (message) {
		return {
			message,
			code: nestedCode,
		};
	}

	return undefined;
};

const isApiResponsePayload = <T>(
	payload: unknown,
): payload is ApiResponse<T> => {
	if (!isRecord(payload)) {
		return false;
	}

	return (
		typeof payload.status === "number" &&
		"data" in payload &&
		typeof payload.timestamp === "string"
	);
};

export const unwrapApiResponseData = <T>(
	payload: ApiResponsePayload<T>,
): T => {
	if (
		isRecord(payload) &&
		"data" in payload &&
		typeof payload.data !== "undefined"
	) {
		if (isApiResponsePayload<T>(payload) || !("status" in payload)) {
			return payload.data as T;
		}
	}

	return payload as T;
};

const parseResponse = async <T>(
	response: Response,
): Promise<T> => {
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
			!Array.isArray(payload)
		) {
			const resolved = resolveErrorMessageAndCode(payload as UnknownRecord);
			if (resolved) {
				throw new ApiError(
					resolved.message,
					response.status,
					resolved.code,
				);
			}
		}

		throw new ApiError(
			typeof payload === "string" && payload.trim()
				? payload
				: `요청이 실패했습니다. (${response.status})`,
			response.status,
		);
	}

	return unwrapApiResponseData(payload as ApiResponsePayload<T>);
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
