import { Number1to9 } from "./types";

export class Square {
    userSet: Number1to9 | null;
    present: Number1to9 | null;
    allowed: Number1to9[];

    constructor() {
        this.userSet = null;
        this.present = null;
        this.allowed = [1,2,3,4,5,6,7,8,9];
    }

    setUser(val: Number1to9) {
        if (this.hasValue()) throw new Error('Already set!');
        if (!this.isAllowed(val)) throw new Error('Not allowed?!');
        this.allowed = [val];
        this.userSet = val;
    }

    hasValue(): boolean {
        return (this.userSet !== null || this.present !== null);
    }

    setPresent(val: Number1to9) {
        if (this.hasValue()) throw new Error('Already set!');
        if (!this.isAllowed(val)) throw new Error('Not allowed?!');
        this.allowed = [val];
        this.present = val;
    }

    exclude(val: Number1to9) {
        this.allowed = this.allowed.filter(v => v !== val);
    }

    isAllowed(val: Number1to9): boolean {
        return this.allowed.find(v => v === val) !== undefined;
    }

    value(): Number1to9 | null {
        if (this.userSet !== null) return this.userSet;
        if (this.present !== null) return this.present;
        return null;
    }
}

