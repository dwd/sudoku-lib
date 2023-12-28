// A sudoku grid is a 9x9 array:
import {Square} from "./square";
import {Number1to9} from "./types";

export const GRID_SIZE = 9;

interface Coord {
    x: number;
    y: number;
    reason: string;
}

export class Grid {
    public array: Square[][]
    public recalcs: Coord[]

    constructor() {
        this.array = new Array<Square[]>(GRID_SIZE)
        this.recalcs = new Array<Coord>();
        for (let i = 0; i != GRID_SIZE; ++i) {
            this.array[i] = new Array<Square>(GRID_SIZE);
            for (let j = 0; j != GRID_SIZE; ++j) {
                this.array[i][j] = new Square();
            }
        }
    }

    pushRecalculate(x: number, y: number, reason: string) {
        this.recalcs.push({x, y, reason});
    }

    doRecalculations() {
        while(true) {
            const c = this.recalcs.pop();
            if (c === undefined) break;
            this.recalculate(c.x, c.y);
        }
    }

    setUser(x: number, y: number, val: Number1to9) {
        this.array[x][y].setUser(val);
        this.recalculate(x, y);
        this.doRecalculations();
    }

    testSubgrid(sgx: number, sgy: number, test: Number1to9) {
        let  foundx;
        let foundy;
        for (let i = 0; i !== 3; ++i) {
            for (let j = 0; j !==3; ++j) {
                if (this.array[sgx+ i][sgy + j].hasValue()) continue;
                if (this.array[sgx + i][sgy + j].isAllowed(test)) {
                    if (foundx !== undefined) {
                        return;
                    }
                    foundx = sgx + i;
                    foundy = sgy + j;
                }
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].setPresent(test);
            this.pushRecalculate(foundx, foundy, `Test subgrid ${sgx}, ${sgy}, ${test}`);
        }
    }

    testColumn(i: number, test: Number1to9) {
        let foundx;
        let foundy;
        for (let j = 0; j !== GRID_SIZE; ++j) {
            if (this.array[i][j].hasValue()) continue;
            if (this.array[i][j].isAllowed(test)) {
                if (foundx !== undefined) {
                    return;
                }
                foundx = i;
                foundy = j;
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].setPresent(test);
            this.pushRecalculate(foundx, foundy, `Test column ${i}, ${test}`);
        }
    }

    testRow(j: number, test: Number1to9) {
        let foundx;
        let foundy;
        for (let i = 0; i !== GRID_SIZE; ++i) {
            if (this.array[i][j].hasValue()) continue;
            if (this.array[i][j].isAllowed(test)){
                if (foundx !== undefined) {
                    return;
                }
                foundx = i;
                foundy = j;
            }
        }
        if (foundx !== undefined && foundy !== undefined) {
            this.array[foundx][foundy].setPresent(test);
            this.pushRecalculate(foundx, foundy, `Test Row ${j}, ${test}`);
        }
    }

    updateAllowed(x: number, y: number) {
        const val = this.array[x][y].allowed[0]
        // First, update allowed:
        // Sub-grid
        const sx = Math.floor(x / 3) * 3;
        const sy = Math.floor(y / 3) * 3;
        for (let i = 0; i != 3; ++i) {
            for (let j = 0; j != 3; ++j) {
                if ((sx + i === x) && (sy + j === y)) continue;
                this.array[sx  + i][sy  + j].exclude(val);
            }
        }
        // Horizontal
        for (let i = 0; i != GRID_SIZE; ++i) {
            if (x === i) continue;
            this.array[i][y].exclude(val);
        }
        // Vertical
        for (let i = 0; i != GRID_SIZE; ++i) {
            if (y === i) continue;
            this.array[x][i].exclude(val);
        }
    }

    recalculate(x: number, y: number) {
        this.updateAllowed(x, y);
        // Next, scan each for "only" option
        for (let i = 0; i != GRID_SIZE; ++i) {
            for (let j = 0; j != GRID_SIZE; ++j) {
                if (this.array[i][j].userSet !== null) continue;
                if (this.array[i][j].present !== null) continue;
                if (this.array[i][j].allowed.length === 1) {
                    const val = this.array[i][j].allowed[0];
                    this.array[i][j].setPresent(val);
                    this.pushRecalculate(i, j, `Sole option ${i}, ${j} == ${val}`);
                }
            }
        }
        // FInally, look for "one remaining" options
        for (let test = 1; test <= 9; ++test) {
            const testValue = test as Number1to9
            for (let sgx = 0; sgx !== 3; ++sgx) {
                for (let sgy = 0; sgy !== 3; ++sgy) {
                    this.testSubgrid(sgx * 3, sgy * 3, testValue);
                }
            }
            for (let i = 0; i != GRID_SIZE; ++i) {
                this.testColumn(i, testValue);
                this.testRow(i, testValue);
            }
        }
    }
}
