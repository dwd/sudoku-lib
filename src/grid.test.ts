import { test, expect } from "@jest/globals";
import { Grid } from "./grid";
import {Number1to9} from "./types";

test("Initial state", () => {
    const g = new Grid();
    expect(g.array[0][0].hasValue()).toBeFalsy();
    expect(g.array[8][8].hasValue()).toBeFalsy();
});

test("Set one", () => {
    const g = new Grid();
    // g.setUser(0, 0, 1);
    g.array[0][0].setUser(1);
    g.updateAllowed(0, 0);
    expect(g.array[0][0].hasValue()).toBeTruthy();
    expect(g.array[0][8].isAllowed(1)).toBeFalsy();
    expect(g.array[1][8].isAllowed(1)).toBeTruthy();
    expect(g.array[8][0].isAllowed(1)).toBeFalsy();
    expect(g.array[8][1].isAllowed(1)).toBeTruthy();
    expect(g.array[2][2].isAllowed(1)).toBeFalsy();
});

test("Set one full", () => {
    const g = new Grid();
    g.setUser(0, 0, 1);
    expect(g.array[0][0].hasValue()).toBeTruthy();
    expect(g.array[0][8].isAllowed(1)).toBeFalsy();
    expect(g.array[1][8].isAllowed(1)).toBeTruthy();
    expect(g.array[8][0].isAllowed(1)).toBeFalsy();
    expect(g.array[8][1].isAllowed(1)).toBeTruthy();
    expect(g.array[2][2].isAllowed(1)).toBeFalsy();
    expect(g.recalcs.length).toBeFalsy();
});

test("Set one check row/column", () => {
    const g = new Grid();
    // g.setUser(0, 0, 1);
    g.array[0][0].setUser(1);
    g.updateAllowed(0, 0);
    expect(g.array[0][0].hasValue()).toBeTruthy();
    expect(g.array[0][8].isAllowed(1)).toBeFalsy();
    expect(g.array[1][8].isAllowed(1)).toBeTruthy();
    expect(g.array[8][0].isAllowed(1)).toBeFalsy();
    expect(g.array[8][1].isAllowed(1)).toBeTruthy();
    expect(g.array[2][2].isAllowed(1)).toBeFalsy();
    g.testRow(0, 1);
    expect(g.recalcs.length).toBe(0);
    g.testRow(0, 2);
    expect(g.recalcs.length).toBe(0);
    g.testRow(1, 1);
    expect(g.recalcs.length).toBe(0);
    g.testRow(1, 2);
    expect(g.recalcs.length).toBe(0);
    g.testColumn(0, 1);
    expect(g.recalcs.length).toBe(0);
    g.testColumn(0, 2);
    expect(g.recalcs.length).toBe(0);
    g.testColumn(1, 1);
    expect(g.recalcs.length).toBe(0);
    g.testColumn(1, 2);
    expect(g.recalcs.length).toBe(0);
});

test("Set row", () => {
    const g = new Grid();
    for (let i = 0; i != 7; ++i) {
        g.setUser(i, 0, (i + 1) as Number1to9);
        expect(g.recalcs.length).toBe(0);
    }
    g.setUser(7, 0,  8);
    expect(g.recalcs.length).toBe(0);
    expect(g.array[8][0].hasValue()).toBeTruthy();
    expect(g.array[8][1].isAllowed(9)).toBeFalsy();
});

test("Set col", () => {
    const g = new Grid();
    for (let i = 0; i != 7; ++i) {
        g.setUser(0, i, (i + 1) as Number1to9);
        expect(g.recalcs.length).toBe(0);
    }
    g.setUser(0, 7,  8);
    expect(g.recalcs.length).toBe(0);
    expect(g.array[0][8].hasValue()).toBeTruthy();
    expect(g.array[1][8].isAllowed(9)).toBeFalsy();
});

test("Set subgrid", () => {
    const g = new Grid();
    for (let i = 0; i != 3; ++i) {
        for (let j = 0; j != 3; ++j) {
            g.setUser(i, j, ((i * 3) + j + 1) as Number1to9);
            expect(g.recalcs.length).toBe(0);
        }
    }
    g.setUser(2, 1,  8);
    expect(g.recalcs.length).toBe(0);
    expect(g.array[2][2].hasValue()).toBeTruthy();
    expect(g.array[2][3].isAllowed(9)).toBeFalsy();
});

test("Pattern", () => {
    const g = new Grid();
    g.setUser(8, 0, 1);
    expect(g.array[2][2].hasValue()).toBeFalsy();
    g.setUser(5, 1, 1);
    expect(g.array[2][2].hasValue()).toBeFalsy();
    g.setUser(0, 6, 1);
    expect(g.array[2][2].hasValue()).toBeFalsy();
    g.setUser(1, 4, 1);
    expect(g.array[2][2].hasValue()).toBeTruthy();
});
