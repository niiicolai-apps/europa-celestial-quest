import * as THREE from 'three';
import { ref } from 'vue';

const marker = ref(null);
const centerY = ref(0.5);
const moveSpeed = ref(0.05);
const moveLength = 0.6;

export default {
    init: (scene) => {
        const markerRadius = 2;  
        const markerHeight = 4;  
        const markerRadialSegments = 16;  
        const markerGeometry = new THREE.ConeGeometry( markerRadius, markerHeight, markerRadialSegments );
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500, transparent: true, opacity: 1 });
        marker.value = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.value.rotation.x = Math.PI;
        marker.value.visible = false;
        scene.add(marker.value);
    },
    dispose: () => {
        marker.value.geometry.dispose();
        marker.value.material.dispose();
        marker.value.parent.remove(marker.value);
        marker.value = null;
    },
    setMarker: (position) => {
        marker.value.position.copy(position);
        centerY.value = marker.value.position.y;
    },
    onSelect: (selectable) => {
        const box3 = new THREE.Box3().setFromObject(selectable);
        const size = box3.getSize(new THREE.Vector3());
        marker.value.position.copy(selectable.position);
        marker.value.position.y += size.y + 0.1;
        marker.value.visible = true;
        centerY.value = marker.value.position.y;
    },
    onDeselect: () => {
        marker.value.visible = false;
    },
    update: () => {
        if (!marker.value.visible) return;
        marker.value.position.y += moveSpeed.value;
        if (marker.value.position.y > centerY.value + moveLength ||
            marker.value.position.y < centerY.value - moveLength) {
            moveSpeed.value = moveSpeed.value * -1;
        }
    },
}
