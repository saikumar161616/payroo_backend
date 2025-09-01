class HelperUtil {
    constructor() {

    }

    // Generates a unique identifier based on current timestamp
    generateUniqueId(): string {
        let uniqueCode = (new Date().getTime()).toString(16).toUpperCase().slice(-7);
        return `EMP-${uniqueCode}`;
    }
}

export const helperUtil = new HelperUtil();