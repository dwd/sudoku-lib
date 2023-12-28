import { test, expect } from "@jest/globals";
import { Square} from "./square";

test('Initial state', () => {
    const sq = new Square();
    expect(sq.hasValue()).toBeFalsy();
})