declare module io.github.nicnguyen.treemap {
    interface Node {
        nodes?: Node[];
        data?: any;
        weight?: number;
        rectangle?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        titleRectangle?: {
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
        public rectangle: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        public titleRectangle: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        constructor(weight: number, data: any);
        static weigh(node: Node): void;
    }
}
declare module io.github.nicnguyen.treemap {
    class Squarifier {
        public squarify(nodes: Node[], width: number, height: number, createRectangle: (x: number, y: number, width: number, height: number, node: Node) => void): void;
        private worst(s, min, max, w);
        private scaleWeights(weights, width, height);
        private max(array);
        private min(array);
        private sum(array);
        private weights(array);
        private PERCENTAGE_OF_HEIGHT_FOR_TITLE;
        public squarifyTreeWithRootNode(rootNode: Node): void;
    }
}
