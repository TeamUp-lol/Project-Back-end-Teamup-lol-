"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)("sample test", () => {
    (0, vitest_1.it)("should test sample test", () => {
        const sample = 1;
        (0, vitest_1.expect)(sample).toBe(1);
    });
});
