declare module treemap {
    interface Node {
        parent?: Node;
        nodes?: Node[];
        data?: any;
        weight?: number;
        frame?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        level?: number;
    }
    class InternalNode implements Node {
        nodes: Node[];
        data: any;
        weight: number;
        frame: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        constructor(weight: number, data: any);
        static weigh(node: Node): void;
    }
}
declare module treemap {
    class Size {
        width: number;
        height: number;
    }
    function maxFontSize(size: Size): number;
    function minFontSize(size: Size): number;
    function fontSize(canvasSize: Size, tileSize: Size): number;
    function tileMarginPercentage(): number;
    function xMargin(tileSize: Size): number;
    function yMargin(tileSize: Size): number;
}
declare module treemap {
    function squarify(rootNode: Node, f: (x: number, y: number, width: number, height: number, node: Node) => void): void;
}
