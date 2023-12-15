import { ref } from 'vue'
import { useDebugLoader } from './debug_loader.js'
import * as THREE from 'three'

const map = ref({})
const mapSortedX = ref([])
const mapSortedZ = ref([])
const isInitialized = ref(false)
const isBaking = ref(false)
const debugLoader = useDebugLoader()
const scene = ref(null)
// Binary search to find the point with the closest x
const binarySearchClosestX = (x, positions, start = 0, end = positions.length - 1) => {
    let closestIndex = start;

    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const midPoint = positions[mid];

        if (Math.abs(midPoint.x - x) < Math.abs(positions[closestIndex].x - x)) {
            closestIndex = mid;
        }

        if (midPoint.x < x) {
            start = mid + 1;
        } else if (midPoint.x > x) {
            end = mid - 1;
        } else {
            return closestIndex;
        }
    }

    return closestIndex;
};

// Binary search to find the point with the closest z for a given x
const binarySearchClosestZ = (x, z, positions, start = 0, end = positions.length - 1) => {
    let closestIndex = start;

    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const midPoint = positions[mid];

        if (Math.abs(midPoint.z - z) < Math.abs(positions[closestIndex].z - z)) {
            closestIndex = mid;
        }

        if (midPoint.x < x) {
            start = mid + 1;
        } else if (midPoint.x > x) {
            end = mid - 1;
        } else {
            return closestIndex;
        }
    }

    return closestIndex;
};
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
const cubes = []
const index = ref(0)
const max = 100



const getCube = () => {
    const cubeClone = cubes[index.value]
    index.value = (index.value + 1) % max
    return cubeClone
}

export const useHeightMap = () => {
    const bake = async (terrainObject3D, scene, size = 1) => {
        if (isBaking.value) return false

        const box3 = new THREE.Box3().setFromObject(terrainObject3D)
        const terrainSize = box3.getSize(new THREE.Vector3())
        const terrainPosition = terrainObject3D.position.clone()
        const topLeft = new THREE.Vector3(
            terrainPosition.x - terrainSize.x / 2,
            0,
            terrainPosition.z - terrainSize.z / 2
        )
        const bottomRight = new THREE.Vector3(
            terrainPosition.x + terrainSize.x / 2,
            0,
            terrainPosition.z + terrainSize.z / 2
        )


        const raycaster = new THREE.Raycaster()
        const p = new THREE.Vector3(0, 0, 0)
        const d = new THREE.Vector3(0, -1, 0)

        let x = topLeft.x
        let z = topLeft.z;
        const totalXIterations = Math.floor((bottomRight.x - topLeft.x) / size)
        const totalZIterations = Math.floor((bottomRight.z - topLeft.z) / size)
        let iterationsXLeft = totalXIterations - Math.floor((bottomRight.x - x) / size)
        let iterationsZLeft = totalZIterations - Math.floor((bottomRight.z - z) / size)

        debugLoader.setProgress(iterationsXLeft)
        debugLoader.setMaxProgress(totalXIterations)
        debugLoader.setTitle('Baking Height Map')
        debugLoader.setDescription(`Iterations left X: ${iterationsXLeft}/${totalXIterations} Z: ${iterationsZLeft}/${totalZIterations}`)
        const points = []
        const bakeInterval = setInterval(() => {

            if (x > bottomRight.x) {
                clearInterval(bakeInterval)
                // const write to height_map.json
                const data = JSON.stringify(points)
                const a = document.createElement('a')
                const file = new Blob([data], { type: 'text/plain' })
                a.href = URL.createObjectURL(file)
                a.download = 'height_map.json'
                a.click()
                isBaking.value = false
                debugLoader.reset()
                return
            }

            p.set(x, 100, z)
            raycaster.set(p, d);
            const intersects = raycaster.intersectObject(terrainObject3D);
            if (intersects.length > 0) {
                points.push({ x, y: intersects[0].point.y, z })
            }

            if (z >= bottomRight.z) {
                z = topLeft.z;
                x += size
            } else {
                z += size
            }

            iterationsXLeft = totalXIterations - Math.floor((bottomRight.x - x) / size)
            iterationsZLeft = totalZIterations - Math.floor((bottomRight.z - z) / size)
            debugLoader.setProgress(iterationsXLeft)
            debugLoader.setDescription(`Iterations X: ${iterationsXLeft}/${totalXIterations} Z: ${iterationsZLeft}/${totalZIterations}`)
        }, 5)

        // Get the y point for every size
        /*
        let c = 0
        for (let x = topLeft.x; x < bottomRight.x; x += size) {
            for (let z = topLeft.z; z < bottomRight.z; z += size) {
                c += 1
                p.set(x, 100, z)
                raycaster.set(p, d);
                const intersects = raycaster.intersectObject(terrainObject3D);
                if (intersects.length > 0) {
                    //const cubeClone = cube.clone()
                    //cubeClone.position.set(x, intersects[0].point.y, z)
                    //scene.add(cubeClone)
                    points.push({ x, y: intersects[0].point.y, z })
                }
            }

        }

        clearInterval(bakeInterval)
        */

        isInitialized.value = true
        isBaking.value = true
    }

    const init = async (_scene) => {
        if (isInitialized.value) return false
        scene.value = _scene
        const src = "/maps/height_map.json"
        const response = await fetch(src)
        const data = await response.json()

        // Sort the data by x
        data.sort((a, b) => a.x - b.x)
        mapSortedX.value = data

        // Sort the data by z
        data.sort((a, b) => a.z - b.z)
        mapSortedZ.value = data

        /*
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        for (const point of data) {
            const cubeClone = cube.clone()
            cubeClone.position.set(point.x, point.y, point.z)
            scene.add(cubeClone)
        }*/

        map.value = data
        isInitialized.value = true
    }

    const getY = (x, z) => {
        if (!isInitialized.value) throw new Error('Height map not initialized')
        if (isBaking.value) return null

        // Find the closest x first
        const closestXIndex = binarySearchClosestX(x, mapSortedX.value);
        // Use the found x to find the closest z
        const closestZIndex = binarySearchClosestZ(mapSortedX.value[closestXIndex].x, z, mapSortedZ.value);
        const closestPoint = mapSortedZ.value[closestZIndex];
        
        const clone = getCube()
        clone.position.set(closestPoint.x, closestPoint.y, closestPoint.z)

        return closestPoint.y;

        /*        
        let closest = null
        let closestDistance = Infinity
        for (const point of map.value) {
            const distance = Math.abs(point.x - x) + Math.abs(point.z - z)
            if (distance < closestDistance) {
                closest = point
                closestDistance = distance
            }
        }
        return closest.y*/
    }

    return {
        bake,
        init,
        getY,
    }
}
