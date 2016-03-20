"use strict";

let hashToColor = function(hash) {
    return {
        r: hash[0],
        g: hash[1],
        b: hash[2]
    };
};

let build = function(node, bounds, vertical) {
    const step = 32;//bounds.step || 10;

    if (node.type === "file") {
        const newBounds = {
            type: "file",
            color: hashToColor(node.hash),
            x: bounds.x,
            y: bounds.y,
            z: bounds.z + step,
            width: bounds.width, height: bounds.height
        };

        return [ newBounds ];
    } else {
        const childCount = Object.keys(node).length;

        const width = vertical? bounds.width : bounds.width / childCount;
        const height = vertical? bounds.height / childCount : bounds.height;

        let x = bounds.x;
        let y = bounds.y;
        let z = bounds.z + step;
        let geometry = [ { type: "dir", x, y, z, width: bounds.width, height: bounds.height }];

        for (let childName in node) {
            const child = node[childName];

            const newBounds = { x, y, z, width, height };

            geometry = geometry.concat(build(child, newBounds, !vertical));

            if (vertical) {
                y += height;
            } else {
                x += width;
            }
        }

        return geometry;
    }
};

module.exports = {
    build
};