var io;
(function (io) {
    (function (github) {
        (function (nicnguyen) {
            (function (treemap) {
                var SearchNode = (function () {
                    function SearchNode() {
                    }
                    return SearchNode;
                })();

                var InternalNode = (function () {
                    function InternalNode(weight, data) {
                        this.weight = 0;
                        this.rectangle = { x: 0, y: 0, width: 0, height: 0 };
                        this.titleRectangle = { x: 0, y: 0, width: 0, height: 0 };
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
            })(nicnguyen.treemap || (nicnguyen.treemap = {}));
            var treemap = nicnguyen.treemap;
        })(github.nicnguyen || (github.nicnguyen = {}));
        var nicnguyen = github.nicnguyen;
    })(io.github || (io.github = {}));
    var github = io.github;
})(io || (io = {}));
var io;
(function (io) {
    (function (github) {
        (function (nicnguyen) {
            (function (treemap) {
                var Squarifier = (function () {
                    function Squarifier() {
                        this.PERCENTAGE_OF_HEIGHT_FOR_TITLE = 0.1;
                    }
                    Squarifier.prototype.squarify = function (nodes, width, height, createRectangle) {
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

                    Squarifier.prototype.worst = function (s, min, max, w) {
                        return Math.max(w * w * max / (s * s), s * s / (w * w * min));
                    };

                    Squarifier.prototype.scaleWeights = function (weights, width, height) {
                        var scale = width * height / this.sum(weights);
                        for (var i = 0; i < weights.length; i++) {
                            weights[i].weight = scale * weights[i].weight;
                        }
                    };

                    Squarifier.prototype.max = function (array) {
                        return Math.max.apply(Math, this.weights(array));
                    };

                    Squarifier.prototype.min = function (array) {
                        return Math.min.apply(Math, this.weights(array));
                    };

                    Squarifier.prototype.sum = function (array) {
                        var total = 0;
                        for (var i = 0; i < array.length; ++i) {
                            total = total + array[i].weight;
                        }
                        return total;
                    };

                    Squarifier.prototype.weights = function (array) {
                        return array.map(function (d) {
                            return d.weight;
                        }, array);
                    };

                    Squarifier.prototype.squarifyTreeWithRootNode = function (rootNode) {
                        treemap.InternalNode.weigh(rootNode);
                        var nodes = new Array();
                        nodes.push(rootNode);
                        while (nodes.length > 0) {
                            var node = nodes.shift();
                            if (node.data) {
                                node.titleRectangle = {
                                    x: node.rectangle.x, y: node.rectangle.y,
                                    width: node.rectangle.width, height: node.rectangle.height * (1 - this.PERCENTAGE_OF_HEIGHT_FOR_TITLE)
                                };
                                node.rectangle.y = node.rectangle.y + this.PERCENTAGE_OF_HEIGHT_FOR_TITLE * node.rectangle.height;
                                node.rectangle.height = (1 - this.PERCENTAGE_OF_HEIGHT_FOR_TITLE) * node.rectangle.height;
                            }
                            this.squarify(node.nodes, node.rectangle.width, node.rectangle.height, function (x, y, width, height, n) {
                                n.rectangle = {
                                    x: node.rectangle.x + x,
                                    y: node.rectangle.y + y,
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
                    };
                    return Squarifier;
                })();
                treemap.Squarifier = Squarifier;
            })(nicnguyen.treemap || (nicnguyen.treemap = {}));
            var treemap = nicnguyen.treemap;
        })(github.nicnguyen || (github.nicnguyen = {}));
        var nicnguyen = github.nicnguyen;
    })(io.github || (io.github = {}));
    var github = io.github;
})(io || (io = {}));
//# sourceMappingURL=treemaps.js.map
