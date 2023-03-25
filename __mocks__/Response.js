import { vi } from "vitest";

export const response = vi.fn(() => {
	return  {
		status: statusCode,
		json: (input) => {
			if (typeof input === "object") return input;
			else {
				return {
					input
				}
			}
		}
	}
});