treemap
=======

Treemaps in JavaScript

An implementation for laying out rectangles in a Treemap, using the algorithm from Squarified Treemaps (1999) by Mark Bruls , Kees Huizing , Jarke van Wijk.

JavaScript is generated from TypeScript source.

See countries.html for a demo.

To use the code, declare a tree like this:

        var tree = {
          frame: {x:0,y:0, width:100, height:100},
          nodes: [
            {
              nodes: [
                {data: "Leaf 1", weight: 0.3},
                {data: "Leaf 2", weight: 0.6}
              ]
            },
            {
              nodes: [
                {data: "Leaf 3", weight: 0.2},
                {data: "Leaf 3", weight: 0.5},
                {data: "Leaf 4", weight: 0.5}
              ]
            }
          ]
        };

and pass it to the API like so:

        treemap.squarify(tree, renderer);
        
the renderer is a callback that looks like this:

        renderer: (x:number,y:number,width:number,height:number,node:Node) => void
  
The example in countries.html uses KineticJS for the rendering.


  
  
  
