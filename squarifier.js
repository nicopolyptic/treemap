var io;
(function (io) {
    (function (github) {
        (function (nicnguyen) {
            (function (treemap) {
                var Input = (function () {
                    function Input(weight, data) {
                        this.weight = weight;
                        this.data = data;
                    }
                    return Input;
                })();
                treemap.Input = Input;

                var Squarifier = (function () {
                    function Squarifier() {
                    }
                    Squarifier.prototype.squarify = function (children, width, height, createRectangle) {
                        this.scaleWeights(children, width, height);
                        children.sort(function (a, b) {
                            return b.weight - a.weight;
                        });
                        children.push({ weight: 0, data: null });
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
                                        createRectangle(rx, ry, z, d, row[j].data);
                                        ry = ry + d;
                                    } else {
                                        createRectangle(rx, ry, d, z, row[j].data);
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
