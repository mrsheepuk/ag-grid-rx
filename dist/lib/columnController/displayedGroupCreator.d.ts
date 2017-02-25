// Type definitions for ag-grid-rx v8.1.1-3
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
import { Column } from "../entities/column";
import { OriginalColumnGroupChild } from "../entities/originalColumnGroupChild";
import { GroupInstanceIdCreator } from "./groupInstanceIdCreator";
import { ColumnGroupChild } from "../entities/columnGroupChild";
export declare class DisplayedGroupCreator {
    private columnUtils;
    private context;
    createDisplayedGroups(sortedVisibleColumns: Column[], balancedColumnTree: OriginalColumnGroupChild[], groupInstanceIdCreator: GroupInstanceIdCreator, oldDisplayedGroups?: ColumnGroupChild[]): ColumnGroupChild[];
    private createColumnGroup(originalGroup, groupInstanceIdCreator, oldColumnsMapped);
    private mapOldGroupsById(displayedGroups);
    private setupParentsIntoColumns(columnsOrGroups, parent);
    private createFakePath(balancedColumnTree);
    private getOriginalPathForColumn(balancedColumnTree, column);
}
