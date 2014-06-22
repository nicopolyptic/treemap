declare module treemap {
    interface Node {
        nodes?: Node[];
        data?: any;
        weight?: number;
        frame?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }
    class InternalNode implements Node {
        public nodes: Node[];
        public data: any;
        public weight: number;
        public frame: {
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
    function squarify(rootNode: Node, f: (x: number, y: number, width: number, height: number, node: Node) => void): void;
}
