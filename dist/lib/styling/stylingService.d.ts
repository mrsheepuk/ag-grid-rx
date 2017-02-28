// Type definitions for ag-grid-rx v8.1.1-4
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { ColDef } from "../entities/colDef";
export declare class StylingService {
    private expressionService;
    processAllCellClasses(colDef: ColDef, params: any, onApplicableClass: (className: string) => void, onNotApplicableClass?: (className: string) => void): void;
    processCellClassRules(colDef: ColDef, params: any, onApplicableClass: (className: string) => void, onNotApplicableClass?: (className: string) => void): void;
    processStaticCellClasses(colDef: ColDef, params: any, onApplicableClass: (className: string) => void): void;
}
