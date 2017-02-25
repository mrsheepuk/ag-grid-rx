// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { IAggFunc } from "../entities/colDef";
export interface IAggFuncService {
    addAggFuncs(aggFuncs: {
        [key: string]: IAggFunc;
    }): void;
    addAggFunc(key: string, aggFunc: IAggFunc): void;
    clear(): void;
    getDefaultAggFunc(): string;
}
