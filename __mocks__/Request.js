import { vi } from "vitest";

export const request = vi.fn(() => {
	return {
		body: input,
		params: input,
		headhers: {
			authorization: input
		}
	}
});

