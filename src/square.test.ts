import { test, expect } from "@jest/globals";
import { Square} from "./square";

test('Initial state', () => {
    const sq = new Square();
    expect(sq.hasValue()).toBeFalsy();
    expect(sq.allowed.length).toBe(9);
    expect(sq.userSet).toBeNull();
    expect(sq.present).toBeNull();
});

test("User set", () => {
    const sq = new Square();
    sq.setUser(1);
    expect(sq.hasValue()).toBeTruthy();
    expect(sq.allowed.length).toBe(1);
    expect(sq.allowed).toContain(1);
    expect(sq.userSet).toBe(1);
    expect(sq.present).toBeNull();
});

test("Present set", () => {
    const sq = new Square();
    sq.setPresent(1);
    expect(sq.hasValue()).toBeTruthy();
    expect(sq.allowed.length).toBe(1);
    expect(sq.allowed).toContain(1);
    expect(sq.userSet).toBeNull();
    expect(sq.present).toBe(1);
});

test("Exclude", () => {
    const sq = new Square();
    sq.exclude(1);
    expect(sq.hasValue()).toBeFalsy();
    expect(sq.allowed.length).toBe(8);
    expect(sq.allowed).not.toContain(1);
    expect(sq.userSet).toBeNull();
    expect(sq.present).toBeNull();
    expect(sq.isAllowed(1)).toBeFalsy();
    expect(sq.isAllowed(2)).toBeTruthy();
})