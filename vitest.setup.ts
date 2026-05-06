import {vi, beforeAll, afterAll} from 'vitest';

const FIXED_TIME = 1778036531388;

beforeAll(() => {
    vi.spyOn(Date, "now").mockReturnValue(FIXED_TIME);
});

afterAll(() => {
    vi.restoreAllMocks();
});