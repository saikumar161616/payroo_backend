class HelperUtil {
    constructor() {

    }

    // Generates a unique identifier based on current timestamp
    generateUniqueId(prefix: string): string {
        let uniqueCode = (new Date().getTime()).toString(16).toUpperCase().slice(-7);
        return `${prefix}-${uniqueCode}`;
    }

    calculateTax(gross: number): number {
        const brackets = [
            { threshold: 5000, rate: 0.45, base: 740 },
            { threshold: 3000, rate: 0.37, base: 365 },
            { threshold: 1500, rate: 0.325, base: 177.5 },
            { threshold: 900, rate: 0.19, base: 53 },
            { threshold: 370, rate: 0.10, base: 0 },
        ];

        for (const bracket of brackets) {
            if (gross > bracket.threshold) {
                return bracket.base + (gross - bracket.threshold) * bracket.rate;
            }
        }
        return 0;
    }
}

export const helperUtil = new HelperUtil();