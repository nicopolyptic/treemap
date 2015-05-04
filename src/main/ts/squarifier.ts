/*
     _   ___                        __            __  _
    / | / (_)________  ____  ____  / /_  ______  / /_(_)____
   /  |/ / / ___/ __ \/ __ \/ __ \/ / / / / __ \/ __/ / ___/
  / /|  / / /__/ /_/ / /_/ / /_/ / / /_/ / /_/ / /_/ / /__
 /_/ |_/_/\___/\____/ .___/\____/_/\__, / .___/\__/_/\___/
                   /_/            /____/_/
 */

/// <reference path="TreeMapNode.ts"/>

module treemap {

    class Squarifier {

        public static squarify(
            nodes: Node[],
            width: number,
            height: number,
            createRectangle: (x:number,y:number,width:number,height:number,node:Node) => void
        ) {
            var children : Node[] = nodes.slice(0);
            this.scaleWeights(nodes, width, height);
            children.sort((a:Node,b:Node) => {return b.weight-a.weight});
            children.push(new InternalNode(0, null));
            var vertical = height < width;
            var w = vertical ? height : width;
            var x = 0, y = 0;
            var rw = width;
            var rh = height;
            var row : Node[] = [];
            while (children.length > 0) {
                    var c = children[0];
                    var r = c.weight;
                    var s = this.sum(row);
                    var min = this.min(row);
                    var max = this.max(row);
                    var wit = this.worst(s+r, Math.min(min, r), Math.max(max, r), w);
                    var without =  this.worst(s, min, max, w);
                    if (row.length == 0 || wit < without) {
                        row.push(c);
                        children.shift();
                    } else {
                        var rx = x;
                        var ry = y;
                        var z = s/w;
                        var j;
                        for(j = 0; j < row.length; ++j) {
                            var d = row[j].weight/z;
                            if (vertical) {
                                createRectangle(rx,ry,z,d,row[j]);
                                ry = ry + d;
                            } else {
                                createRectangle(rx,ry,d,z,row[j]);
                                rx = rx + d;
                            }
                        }
                        if (vertical) {
                            x = x + z;
                            rw = rw - z;
                        } else {
                            y = y +z;
                            rh = rh - z;
                        }

                        vertical = rh < rw;
                        w = vertical ? rh : rw;
                        row = [];
                    }
            }
        }

        private static worst(s: number, min: number, max: number, w: number) {
            return Math.max(w*w*max/(s*s), s*s/(w*w*min));
        }

        private static scaleWeights(weights: Node[], width:number, height: number) {
            var scale = width*height/this.sum(weights);
            for (var i = 0; i < weights.length; i ++) {
                weights[i].weight = scale * weights[i].weight;
            }
        }

        private static max(array: Node[]) {
            return Math.max.apply( Math, this.weights(array) );
        }

        private static min(array: Node[]) {
            return Math.min.apply( Math, this.weights(array) );
        }

        private static sum(array: Node[]) {
            var total = 0;
            for (var i = 0; i < array.length; ++i) {
                total = total + array[i].weight;
            }
            return total;
        }

        private static weights(array: Node[]) {
            return array.map(d => d.weight, array);
        }
    }

    export function squarify(
                rootNode : Node,
                f: (x:number,y:number,width:number,height:number,node:Node) => void
    ) {
        InternalNode.weigh(rootNode);
        var nodes = new Array<Node>();
        nodes.push(rootNode);
        // level ordered traversal
        while(nodes.length > 0) {
             var node = nodes.shift();
             if (node.nodes && node.nodes.length > 0) {
                 Squarifier.squarify(
                    node.nodes,
                    node.frame.width,
                    node.frame.height,
                    (x:number,y:number,width:number,height:number, n:Node) => {
                        n.frame = {
                            x:node.frame.x+x,
                            y:node.frame.y+y,
                            width:width,
                            height:height
                        };
                    }
                 );

                 for (var i =0; i < node.nodes.length; ++i) {
                    var childNode = node.nodes[i];
                    if (childNode.nodes && childNode.nodes.length >0) {
                        nodes.push(childNode);
                    }
                 }
             }
        }

        nodes.push(rootNode);
        while (nodes.length > 0) {
            var node = nodes.pop();
            f(node.frame.x, node.frame.y, node.frame.width, node.frame.height, node);
            if (node.nodes) {
                for (var i =0; i < node.nodes.length; ++i) {
                    nodes.push(node.nodes[i]);
                }
            }
        }
    }
}