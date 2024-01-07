import { test, expect } from "@jest/globals";
import { Grid } from "./grid";
import {Number1to9} from "./types";

test("Initial state", () => {
    const g = new Grid();
    expect(g.isSolved()).toBeFalsy();
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
            const val = (i * 3) + j + 1 as Number1to9;
            if (val >= 8) {
                break;
            }
            g.setUser(i, j, ((i * 3) + j + 1) as Number1to9);
        }
    }
    expect(g.array[2][1].hasValue()).toBeFalsy();
    expect(g.array[2][2].hasValue()).toBeFalsy();
    expect(g.array[2][3].isAllowed(9)).toBeTruthy();
    g.setUser(2, 1,  8);
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

test("Puzzle", () => {
    const g = new Grid();
    const n = null;
    const vals: (Number1to9 | null)[][] = [
        [n,n,3,7,n,6,n,n,5],
        [2,n,7,8,9,n,6,4,n],
        [n,n,n,n,4,n,n,3,7],
        [n,n,n,n,n,2,3,n,4],
        [n,n,2,9,n,4,7,n,n],
        [4,n,9,1,n,n,n,n,n],
        [8,2,n,n,1,n,n,n,n],
        [n,1,5,n,7,8,4,n,9],
        [9,n,n,3,n,5,1,n,n],
    ];
    const answer: (Number1to9|null)[][] = [
        [1,4,3,7,2,6,9,8,5],
        [2,5,7,8,9,3,6,4,1],
        [6,9,8,5,4,1,2,3,7],
        [7,8,1,6,5,2,3,9,4],
        [5,3,2,9,8,4,7,1,6],
        [4,6,9,1,3,7,8,5,2],
        [8,2,6,4,1,9,5,7,3],
        [3,1,5,2,7,8,4,6,9],
        [9,7,4,3,6,5,1,2,8],
    ];
    vals.map((row, y) => {
        row.map((val, x) => {
            if (val !== null) {
                console.log(`Setting ${x},${y} to ${val}`);
                if (g.array[x][y].hasValue()) {
                    expect(g.array[x][y].value()).toBe(answer[y][x]);
                } else {
                    g.setUser(x, y, val);
                }
            }
        });
    });
    answer.map((row, y) => {
        row.map((val, x) => {
            expect(g.array[x][y].hasValue()).toBeTruthy();
            expect(g.array[x][y].value()).toBe(val);
        });
    });
    expect(g.isSolved()).toBeTruthy();
})

test("Hard Puzzle", () => {
    const g = new Grid();
    const n = null;
    const vals: (Number1to9 | null)[][] = [
        [n,2,n,3,n,6,n,n,n],
        [6,n,n,n,1,n,7,n,n],
        [n,n,n,n,n,5,6,1,n],
        [n,n,8,n,n,n,3,2,n],
        [n,n,n,9,n,7,n,n,n],
        [n,6,3,n,n,n,4,n,n],
        [n,3,1,5,n,n,n,n,n],
        [n,n,5,n,7,n,n,n,8],
        [n,n,n,1,n,4,n,5,n],
    ];
    const answer: (Number1to9|null)[][] = [
        [1,2,7,3,9,6,8,4,5],
        [6,5,9,4,1,8,7,3,2],
        [3,8,4,7,2,5,6,1,9],
        [5,9,8,6,4,1,3,2,7],
        [4,1,2,9,3,7,5,8,6],
        [7,6,3,8,5,2,4,9,1],
        [8,3,1,5,6,9,2,7,4],
        [9,4,5,2,7,3,1,6,8],
        [2,7,6,1,8,4,9,5,3],
    ];
    vals.map((row, y) => {
        row.map((val, x) => {
            if (val !== null) {
                if (g.array[x][y].hasValue()) {
                    expect(g.array[x][y].value()).toBe(answer[y][x]);
                } else {
                    g.setUser(x, y, val);
                }
            }
        });
    });
    expect(g.isSolved()).toBeFalsy();
    g.solve();
    answer.map((row, y) => {
        row.map((val, x) => {
            expect(g.array[x][y].hasValue()).toBeTruthy();
            expect(g.array[x][y].value()).toBe(val);
        });
    });
    expect(g.isSolved()).toBeTruthy();
})

test("From scratch", () => {
    const g = new Grid();
    expect(g.isSolved()).toBeFalsy();
    g.solve();
    expect(g.isSolved()).toBeTruthy();
})

