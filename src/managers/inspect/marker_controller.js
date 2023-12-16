import * as THREE from 'three';
import { ref } from 'vue';

const marker = ref(null);

export default {
    init: (scene) => {
        const markerRadius = 1;  
        const markerHeight = 3;  
        const markerRadialSegments = 16;  
        const markerGeometry = new THREE.ConeGeometry( markerRadius, markerHeight, markerRadialSegments );
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });
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
    },
    onSelect: (selectable) => {
        const box3 = new THREE.Box3().setFromObject(selectable);
        const size = box3.getSize(new THREE.Vector3());
        marker.value.position.copy(selectable.position);
        marker.value.position.y += size.y + 0.1;
        marker.value.visible = true;
    },
    onDeselect: () => {
        marker.value.visible = false;
    },
}
