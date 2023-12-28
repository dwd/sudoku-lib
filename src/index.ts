// A sudoku grid is a 9x9 array:
export const GRID_SIZE = 9;

// Define a type that is a number from 1 to 9 inclusive
export type Number1to9 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Square {
    userSet: Number1to9 | null,
    present: Number1to9 | null,
    allowed: Number1to9[],
}

export class Grid {
    public array: Square[][]

    constructor() {
        this.array = new Array<Square[]>(GRID_SIZE)
        for (let i = 0; i != GRID_SIZE; ++i) {
            this.array[i] = new Array<Square>(GRID_SIZE);
            for (let j = 0; j != GRID_SIZE; ++j) {
                this.array[i][j] = { userSet: null, present: null, allowed: [1, 2, 3, 4, 5, 6, 7, 8, 9] };
            }
        }
    }

    setUser(x: number, y: number, val: Number1to9) {
        this.array[x][y].userSet = val;
        this.array[x][y].allowed = [val];
        this.recalculate(x, y);
    }

    testSubgrid(sgx: number, sgy: number, test: Number1to9) {
        let  foundx;
        let foundy;
        for (let i = 0; i !== 3; ++i) {
            for (let j = 0; j !==3; ++j) {
                if (this.array[i][j].userSet !== null) continue;
                if (this.array[i][j].present !== null) continue;
                if (this.array[sgx + i][sgy + j].allowed.find((v) => v === test) !== undefined) {
                    if (foundx !== undefined) {
                        return;
                    }
                    foundx = sgx + i;
                    foundy = sgy + j;
                }
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].present = test;
            this.array[foundx][foundy].allowed = [test];
            this.recalculate(foundx, foundy);
        }
    }

    testColumn(i: number, test: Number1to9) {
        let foundx;
        let foundy;
        for (let j = 0; j !== GRID_SIZE; ++j) {
            if (this.array[i][j].userSet !== null) continue;
            if (this.array[i][j].present !== null) continue;
            if (this.array[i][j].allowed.find((v) => v === test) !== undefined) {
                if (foundx !== undefined) {
                    return;
                }
                foundx = i;
                foundy = j;
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].present = test;
            this.array[foundx][foundy].allowed = [test];
            this.recalculate(foundx, foundy);
        }
    }

    testRow(j: number, test: Number1to9) {
        let foundx;
        let foundy;
        for (let i = 0; j !== GRID_SIZE; ++j) {
            if (this.array[i][j].userSet !== null) continue;
            if (this.array[i][j].present !== null) continue;
            if (this.array[i][j].allowed.find((v) => v === test) !== undefined) {
                if (foundx !== undefined) {
                    return;
                }
                foundx = i;
                foundy = j;
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].present = test;
            this.array[foundx][foundy].allowed = [test];
            this.recalculate(foundx, foundy);
        }
    }

    recalculate(x: number, y: number) {
        const val = this.array[x][y].allowed[0]
        // First, update allowed:
       // Sub-grid
        const sx = Math.floor(x / 3)
        const sy = Math.floor(y / 3)
        for (let i = 0; i != 3; ++i) {
            for (let j = 0; j != 3; ++j) {
                if ((sx + i === x) && (sy + j === y)) continue;
                this.array[sx  + i][sy  + j].allowed = this.array[sx + i][sy + j].allowed.filter(num => num !== val);
            }
        }
       // Horizontal
        for (let i = 0; i != GRID_SIZE; ++i) {
            if (x === i) continue;
            this.array[i][y].allowed = this.array[i][y].allowed.filter(num => num !== val);
        }
       // Vertical
        for (let i = 0; i != GRID_SIZE; ++i) {
            if (y === i) continue;
            this.array[x][i].allowed = this.array[x][i].allowed.filter(num => num !== val);
        }
        // Next, scan each for "only" option
        for (let i = 0; i != GRID_SIZE; ++i) {
            for (let j = 0; j != GRID_SIZE; ++j) {
                if (this.array[i][j].userSet !== null) continue;
                if (this.array[i][j].present !== null) continue;
                if (this.array[i][j].allowed.length === 1) {
                    this.array[i][j].present = this.array[i][j].allowed[0];
                    this.recalculate(i, j);
                }
            }
        }
        // FInally, look for "one remaining" options
        for (let test = 1; test <= 9; ++test) {
            const testValue = test as Number1to9
            for (let sgx = 0; sgx !== 3; ++sgx) {
                for (let sgy = 0; sgy !== 3; ++sgy) {
                    this.testSubgrid(sgx, sgy, testValue);
                }
            }
            for (let i = 0; i != GRID_SIZE; ++i) {
                this.testColumn(i, testValue);
                this.testRow(i, testValue);
            }
        }
    }
}
