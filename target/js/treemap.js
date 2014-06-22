var treemap;
(function (treemap) {
    var SearchNode = (function () {
        function SearchNode() {
        }
        return SearchNode;
    })();

    var InternalNode = (function () {
        function InternalNode(weight, data) {
            this.weight = 0;
            this.frame = { x: 0, y: 0, width: 0, height: 0 };
            this.weight = weight;
            this.data = data;
        }
        InternalNode.weigh = function (node) {
            var nodeLevel2Nodes = new Array();
            var nodeList = new Array();
            nodeList.push({ node: node, level: 0 });
            while (nodeList.length > 0) {
                var searchNode = nodeList.pop();
                if (!nodeLevel2Nodes[searchNode.level]) {
                    nodeLevel2Nodes[searchNode.level] = new Array();
                }
                nodeLevel2Nodes[searchNode.level].push(searchNode.node);
                if (searchNode.node.nodes) {
                    for (var i = 0; i < searchNode.node.nodes.length; ++i) {
                        nodeList.push({ node: searchNode.node.nodes[i], level: searchNode.level + 1 });
                    }
                }
            }

            for (var i = nodeLevel2Nodes.length - 2; i >= 0; --i) {
                for (var j = 0; j < nodeLevel2Nodes[i].length; ++j) {
                    var weight = 0;
                    for (var k = 0; k < nodeLevel2Nodes[i][j].nodes.length; ++k) {
                        weight = weight + nodeLevel2Nodes[i][j].nodes[k].weight;
                    }
                    nodeLevel2Nodes[i][j].weight = weight;
                }
            }
        };
        return InternalNode;
    })();
    treemap.InternalNode = InternalNode;
})(treemap || (treemap = {}));
var treemap;
(function (treemap) {
    var Squarifier = (function () {
        function Squarifier() {
        }
        Squarifier.squarify = function (nodes, width, height, createRectangle) {
            var children = nodes.slice(0);
            this.scaleWeights(nodes, width, height);
            children.sort(function (a, b) {
                return b.weight - a.weight;
            });
            children.push(new treemap.InternalNode(0, null));
            var vertical = height < width;
            var w = vertical ? height : width;
            var x = 0, y = 0;
            var rw = width;
            var rh = height;
            var row = [];
            while (children.length > 0) {
                var c = children[0];
                var r = c.weight;
                var s = this.sum(row);
                var min = this.min(row);
                var max = this.max(row);
                var wit = this.worst(s + r, Math.min(min, r), Math.max(max, r), w);
                var without = this.worst(s, min, max, w);
                if (row.length == 0 || wit < without) {
                    row.push(c);
                    children.shift();
                } else {
                    var rx = x;
                    var ry = y;
                    var z = s / w;
                    var j;
                    for (j = 0; j < row.length; ++j) {
                        var d = row[j].weight / z;
                        if (vertical) {
                            createRectangle(rx, ry, z, d, row[j]);
                            ry = ry + d;
                        } else {
                            createRectangle(rx, ry, d, z, row[j]);
                            rx = rx + d;
                        }
                    }
                    if (vertical) {
                        x = x + z;
                        rw = rw - z;
                    } else {
                        y = y + z;
                        rh = rh - z;
                    }

                    vertical = rh < rw;
                    w = vertical ? rh : rw;
                    row = [];
                }
            }
        };

        Squarifier.worst = function (s, min, max, w) {
            return Math.max(w * w * max / (s * s), s * s / (w * w * min));
        };

        Squarifier.scaleWeights = function (weights, width, height) {
            var scale = width * height / this.sum(weights);
            for (var i = 0; i < weights.length; i++) {
                weights[i].weight = scale * weights[i].weight;
            }
        };

        Squarifier.max = function (array) {
            return Math.max.apply(Math, this.weights(array));
        };

        Squarifier.min = function (array) {
            return Math.min.apply(Math, this.weights(array));
        };

        Squarifier.sum = function (array) {
            var total = 0;
            for (var i = 0; i < array.length; ++i) {
                total = total + array[i].weight;
            }
            return total;
        };

        Squarifier.weights = function (array) {
            return array.map(function (d) {
                return d.weight;
            }, array);
        };
        return Squarifier;
    })();

    function squarify(rootNode, f) {
        treemap.InternalNode.weigh(rootNode);
        var nodes = new Array();
        nodes.push(rootNode);

        while (nodes.length > 0) {
            var node = nodes.shift();
            if (node.nodes && node.nodes.length > 0) {
                Squarifier.squarify(node.nodes, node.frame.width, node.frame.height, function (x, y, width, height, n) {
                    n.frame = {
                        x: node.frame.x + x,
                        y: node.frame.y + y,
                        width: width,
                        height: height
                    };
                });

                for (var i = 0; i < node.nodes.length; ++i) {
                    var childNode = node.nodes[i];
                    if (childNode.nodes && childNode.nodes.length > 0) {
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
                for (var i = 0; i < node.nodes.length; ++i) {
                    nodes.push(node.nodes[i]);
                }
            }
        }
    }
    treemap.squarify = squarify;
})(treemap || (treemap = {}));
//# sourceMappingURL=treemap.js.map
