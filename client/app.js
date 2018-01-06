(function() {
    "use strict";

    const fs = require("fs");

    const tree = require("./tree");
    const fsgeo = require("./fs-geometry");

    const canvas = document.getElementById("viewport");

    // handle resize
    window.onresize = function(event) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var scene, camera, renderer;
    var geometry, material, rootObj;
    let vx = 0;
    let vy = 0;

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 800;

        let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        let solidMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });

        const ftree = tree.getFileTree("./");
        const fsGeometry = fsgeo.build(ftree, { x: 0, y: 0, z: 0, width: 512, height: 512, step: 1 });

        rootObj = new THREE.Object3D();

        fsGeometry.forEach((g) => {
            let material = g.type === "file"? solidMaterial.clone() : wireMaterial;
            let geometry = new THREE.PlaneGeometry(g.width, g.height);
            let mesh = new THREE.Mesh(geometry, material);

            if (g.type === "file")
                mesh.material.color.setHex((g.color.r << 16) | (g.color.g << 8) | g.color.b);

            mesh.position.x = g.x + g.width / 2 - 256;
            mesh.position.y = g.y + g.height / 2 - 256;
            mesh.position.z = g.z;

            rootObj.add(mesh);
        });

        scene.add(rootObj);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);

        rootObj.rotation.x += vx;
        rootObj.rotation.y += vy;

        renderer.render(scene, camera);
    }

    window.onkeydown = function(event) {
        switch (event.keyCode) {
            case 87:
                vx = 0.01;
                break;
            case 83:
                vx = -0.01;
                break;
            case 65:
                vy = 0.01;
                break;
            case 68:
                vy = -0.01;
                break;
        }
    };

    window.onkeyup = function(event) {
        switch (event.keyCode) {
            case 87:
                vx = 0.0;
                break;
            case 83:
                vx = 0.0;
                break;
            case 65:
                vy = 0.0;
                break;
            case 68:
                vy = 0.0;
                break;
        }
    };

    init();
    animate();
})();
