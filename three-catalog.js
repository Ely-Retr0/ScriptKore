document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("canvas-container");
    
    const platforms = [
        { name: "Linux", file: "models/linux.glb", scaleMult: 1.1, posY: 0.0 }, 
        { name: "Windows", file: "models/windows.glb", scaleMult: 1.0, posY: 0.0 }, 
        { name: "Xbox", file: "models/xbox.glb", scaleMult: 1.1, posY: 0.0 },       
        { name: "PlayStation", file: "models/ps5.glb", scaleMult: 0.9, posY: -0.2 },         
        { name: "Switch", file: "models/switch.glb", scaleMult: 1.3, posY: 0.0 }     
    ];

    platforms.forEach((platform) => {
        const wrapper = document.createElement('div');
        // AQUÍ ESTÁ LA MAGIA: Le damos una clase única basada en su nombre
        wrapper.className = 'model-wrapper platform-' + platform.name.toLowerCase();
        
        const label = document.createElement('div');
        label.className = 'model-label';
        label.innerText = platform.name;
        
        wrapper.appendChild(label);
        container.appendChild(wrapper);

        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(50, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding; 
        wrapper.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        let pivot = new THREE.Group(); 
        scene.add(pivot);

        const loader = new THREE.GLTFLoader();
        loader.load(
            platform.file,
            function (gltf) {
                const model = gltf.scene;
                
                const box = new THREE.Box3();
                box.makeEmpty();
                
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.computeBoundingBox();
                        child.updateWorldMatrix(true, true);
                        const childBox = child.geometry.boundingBox.clone();
                        childBox.applyMatrix4(child.matrixWorld);
                        box.union(childBox);
                    }
                });

                if (box.isEmpty()) return;

                const size = new THREE.Vector3();
                box.getSize(size);
                const center = new THREE.Vector3();
                box.getCenter(center);

                model.position.x = -center.x;
                model.position.y = -center.y;
                model.position.z = -center.z;
                
                const scaleGroup = new THREE.Group();
                scaleGroup.add(model);
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const targetSize = 2.5; 
                const baseScale = maxDim > 0 ? (targetSize / maxDim) : 1;
                const finalScale = baseScale * platform.scaleMult;
                
                scaleGroup.scale.set(finalScale, finalScale, finalScale);
                scaleGroup.position.y = platform.posY;
                
                pivot.add(scaleGroup);
            },
            undefined,
            function (error) {
                console.error('Error cargando ' + platform.file, error);
            }
        );

        function animate() {
            requestAnimationFrame(animate);
            pivot.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                if (width > 0 && height > 0) {
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
        });
        resizeObserver.observe(wrapper);

        animate();
    });
});