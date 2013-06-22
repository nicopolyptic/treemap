module io.github.nicnguyen.treemap {

    export class Input {
        public weight: number;
        public data;
        constructor(weight: number, data: any) {
            this.weight = weight;
            this.data = data;
        }
    }

    export class Squarifier {

        squarify(children: Input[], width: number, height: number, createRectangle: (x:number,y:number,width:number,height:number,data:any) => void) {

            this.scaleWeights(children, width, height);
            children.sort(function(a:Input,b:Input){return b.weight-a.weight});
            children.push({weight:0,data:null});
            var vertical = height < width;
            var w = vertical ? height : width;
            var x = 0, y = 0;
            var rw = width;
            var rh = height;
            var row : Input[] = [];
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
                                createRectangle(rx,ry,z,d,row[j].data);
                                ry = ry + d;
                            } else {
                                createRectangle(rx,ry,d,z,row[j].data);
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

        private scaleWeights(weights: Input[], width:number, height: number) {
            var scale = width*height/this.sum(weights);
            for (var i = 0; i < weights.length; i ++) {
                weights[i].weight = scale * weights[i].weight;
            }
        }

        private max(array: Input[]) {
            return Math.max.apply( Math, this.weights(array) );
        }

        private min(array: Input[]) {
            return Math.min.apply( Math, this.weights(array) );
        }

        private sum(array: Input[]) {
            var total = 0;
            for (var i = 0; i < array.length; ++i) {
                total = total + array[i].weight;
            }
            return total;
        }

        private weights(array: Input[]) {
            return array.map(function(d){return d.weight;}, array);
        }
    }
}