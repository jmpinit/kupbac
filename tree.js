"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require('crypto');

const getFileTree = function(filepath) {
    const fileStats = fs.lstatSync(filepath);

    if (fileStats.isDirectory()) {
        // a directory
        const directory = {};

        fs.readdirSync(filepath).forEach((fn) => {
            directory[fn] = getFileTree(path.join(filepath, fn));
        });

        return directory;
    } else if (fileStats.isFile()) {
        // a file
        const contents = fs.readFileSync(filepath);

        const md5sum = crypto.createHash('md5');
        md5sum.update(contents);

        return {
            type: "file",
            hash: md5sum.digest(),
            size: fileStats.size
        };
    } else {
        return {
            type: "file",
            hash: 0,
            size: 0
        };
    }
};

const treesum = function(tree) {
    if (tree.type === "file") {
        return tree.size;
    } else {
        let sum = 0;
        for (let key in tree) {
            let child = tree[key];
            sum += treesum(child);
        }
        return sum;
    }
};

module.exports = {
    getFileTree,
    treesum
};