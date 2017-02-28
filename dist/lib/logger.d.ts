// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
export declare class LoggerFactory {
    private logging;
    private setBeans(gridOptionsWrapper);
    create(name: string): Logger;
}
export declare class Logger {
    private logging;
    private name;
    constructor(name: string, logging: boolean);
    log(message: string): void;
}
