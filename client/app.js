"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

const tree = require("./client/tree");

// bounds like { x, y, w, h }
const drawTree = function(filetree, ctx, bounds, vertical) {
    console.log(Object.keys(filetree));

    const sum = (arr) => arr.reduce((t, v) => t + v, 0);
    
    const normalize = (arr) => {
        const total = sum(arr);
        return arr.map((v) => v / total);
    };

    if (filetree.type === "file") {
        //console.log("dead", tree);
        const rc = () => Math.floor(256 * Math.random());
        ctx.fillStyle = `rgb(${rc()},${rc()},${rc()})`;
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    } else {
        const sizes = [];
        const nodes = [];
        for (let key in filetree) {
            let node = filetree[key];
            sizes.push(tree.treesum(node));
            nodes.push(node);
        }

        const norm = normalize(sizes);

        // TODO refactor for DRY
        if (vertical) {
            for (let i = 0, y = bounds.y; i < norm.length; i++) {
                const thickness = norm[i] * bounds.height;

                const innerbounds = {
                    x: bounds.x, y: y,
                    width: bounds.width, height: thickness
                };

                drawTree(nodes[i], ctx, innerbounds, !vertical);

                y += thickness;
            }
        } else {
            for (let i = 0, x = bounds.x; i < norm.length; i++) {
                const thickness = norm[i] * bounds.width;

                const innerbounds = {
                    x: x, y: bounds.y,
                    width: thickness, height: bounds.height
                };

                drawTree(nodes[i], ctx, innerbounds, !vertical);

                x += thickness;
            }
        }
    }
};

const filetree = tree.getFileTree("./node_modules");

const canvas = document.getElementById("viewport");

const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawTree(filetree, ctx, { x: 0, y: 0, width: canvas.width, height: canvas.height });