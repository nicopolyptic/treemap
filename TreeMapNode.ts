module io.github.nicnguyen.treemap {

    class SearchNode {
        node : Node;
        level : number;
    }

    export interface Node {
        nodes? : Node[];
        data?: any;
        weight?: number;
        rectangle? : {x: number; y : number; width: number; height:number};
        titleRectangle? : {x: number; y : number; width: number; height:number};
    }

    export class InternalNode implements Node {

        public nodes : Node[];
        public data: any;
        public weight: number = 0;
        public rectangle : {x: number; y : number; width: number; height:number} = {x:0,y:0,width:0,height:0};
        public titleRectangle : {x: number; y : number; width: number; height:number} = {x:0,y:0,width:0,height:0};

        constructor(weight:number, data:any) {
            this.weight = weight;
            this.data = data;
        }

        public static weigh (node : Node) {
            var nodeLevel2Nodes : Node[][] = new Array<Node[]>();
            var nodeList = new Array<SearchNode>();
            nodeList.push({node:node, level: 0});
            while(nodeList.length > 0) {
                var searchNode = nodeList.pop();
                if (!nodeLevel2Nodes[searchNode.level]) {
                    nodeLevel2Nodes[searchNode.level] = new Array<Node>();
                }
                nodeLevel2Nodes[searchNode.level].push(searchNode.node);
                if (searchNode.node.nodes) {
                    for (var i = 0; i < searchNode.node.nodes.length; ++i) {
                        nodeList.push({node: searchNode.node.nodes[i], level: searchNode.level + 1});
                    }
                }
            }

            for( var i = nodeLevel2Nodes.length-2; i >=0; --i ) {
                for( var j = 0; j < nodeLevel2Nodes[i].length; ++j) {
                    var weight = 0;
                    for (var k = 0; k < nodeLevel2Nodes[i][j].nodes.length; ++k) {
                        weight = weight + nodeLevel2Nodes[i][j].nodes[k].weight;
                    }
                    nodeLevel2Nodes[i][j].weight = weight;
                }
            }
        }
    }
}