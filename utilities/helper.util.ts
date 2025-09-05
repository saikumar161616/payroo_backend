import { v4 as uuid } from "uuid";

class HelperUtil {
    constructor() {

    }

    // Generates a unique identifier based on current timestamp
    generateUniqueId(prefix: string): string {
        // let uniqueCode = (new Date().getTime()).toString(16).toUpperCase().slice(-8);
        let uniqueCode = uuid().toUpperCase().replace(/-/g, "").slice(0, 8);
        return `${prefix}-${uniqueCode}`;
    }

    calculateTax(gross: number): number {
        let tax = 0;
        if (gross > 5000) {
            tax += (gross - 5000) * 0.45;
            gross = 5000;
        }
        if (gross > 3000) {
            tax += (gross - 3000) * 0.37;
            gross = 3000;
        }
        if (gross > 1500) {
            tax += (gross - 1500) * 0.325;
            gross = 1500;
        }
        if (gross > 900) {
            tax += (gross - 900) * 0.19;
            gross = 900;
        }
        if (gross > 370) {
            tax += (gross - 370) * 0.10;
            gross = 370;
        }
        return tax;
    }
}

export const helperUtil = new HelperUtil();