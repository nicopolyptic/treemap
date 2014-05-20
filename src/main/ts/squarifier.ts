module io.github.nicnguyen.treemap {

    export class Squarifier {

        public squarify(
            nodes: Node[],
            width: number,
            height: number,
            createRectangle: (x:number,y:number,width:number,height:number,node:Node) => void
        ) {
            var children = nodes.slice(0);
            this.scaleWeights(nodes, width, height);
            children.sort(function(a:Node,b:Node){return b.weight-a.weight});
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

        private worst(s: number, min: number, max: number, w: number) {
            return Math.max(w*w*max/(s*s), s*s/(w*w*min));
        }

        private scaleWeights(weights: Node[], width:number, height: number) {
            var scale = width*height/this.sum(weights);
            for (var i = 0; i < weights.length; i ++) {
                weights[i].weight = scale * weights[i].weight;
            }
        }

        private max(array: Node[]) {
            return Math.max.apply( Math, this.weights(array) );
        }

        private min(array: Node[]) {
            return Math.min.apply( Math, this.weights(array) );
        }

        private sum(array: Node[]) {
            var total = 0;
            for (var i = 0; i < array.length; ++i) {
                total = total + array[i].weight;
            }
            return total;
        }

        private weights(array: Node[]) {
            return array.map(d => d.weight, array);
        }

        private PERCENTAGE_OF_HEIGHT_FOR_TITLE : number = 0.1;

        public squarifyTreeWithRootNode(rootNode : Node) {
            InternalNode.weigh(rootNode);
            var nodes = new Array<Node>();
            nodes.push(rootNode);
            while(nodes.length > 0) {
                 var node = nodes.shift();
                 if (node.data) {
                    node.titleRectangle = {
                        x:node.rectangle.x, y:node.rectangle.y,
                        width:node.rectangle.width, height:node.rectangle.height* (1-this.PERCENTAGE_OF_HEIGHT_FOR_TITLE)
                    };
                    node.rectangle.y = node.rectangle.y + this.PERCENTAGE_OF_HEIGHT_FOR_TITLE * node.rectangle.height;
                    node.rectangle.height = (1-this.PERCENTAGE_OF_HEIGHT_FOR_TITLE) * node.rectangle.height;
                 }
                 this.squarify(
                    node.nodes,
                    node.rectangle.width,
                    node.rectangle.height,
                    (x:number,y:number,width:number,height:number, n:Node) => {
                        n.rectangle = {
                            x:node.rectangle.x+x,
                            y:node.rectangle.y+y,
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
    }
}