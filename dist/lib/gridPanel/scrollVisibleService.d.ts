// Type definitions for ag-grid-rx v8.1.0
// Project: https://github.com/mrsheepuk/ag-grid-rx
// Definitions by: Niall Crosby <https://github.com/ceolter/>
export interface SetScrollsVisibleParams {
    vBody: boolean;
    hBody: boolean;
    vPinnedLeft: boolean;
    vPinnedRight: boolean;
}
export declare class ScrollVisibleService {
    private eventService;
    private columnController;
    private vBody;
    private hBody;
    private vPinnedLeft;
    private vPinnedRight;
    setScrollsVisible(params: SetScrollsVisibleParams): void;
    isVBodyShowing(): boolean;
    isHBodyShowing(): boolean;
    isVPinnedLeftShowing(): boolean;
    isVPinnedRightShowing(): boolean;
    getPinnedLeftWidth(): number;
    getPinnedLeftWithScrollWidth(): number;
    getPinnedRightWidth(): number;
    getPinnedRightWithScrollWidth(): number;
}
