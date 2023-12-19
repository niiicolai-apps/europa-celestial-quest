let cameraMovementInterval = null;
let cameraInterval = null;
let particlesInterval = null;
let meshesInterval = null;
let interval = null;

const moveCamera = (
    camera, 
    dpx=0, dpy=0, dpz=0, 
    drx=0, dry=0, drz=0,
    dsx_min=0, dsy_min=0, dsz_min=0,
    dsx_max=0, dsy_max=0, dsz_max=0
    ) => {
    cameraMovementInterval = setInterval(() => {
        if (dpx !== 0 || dpy !== 0 || dpz !== 0) {
            camera.position.set(
                camera.position.x + dpx,
                camera.position.y + dpy,
                camera.position.z + dpz
            );
        }

        if (drx !== 0 || dry !== 0 || drz !== 0) {
            camera.rotation.set(
                camera.rotation.x + drx,
                camera.rotation.y + dry,
                camera.rotation.z + drz
            );
        }

        if (dsx_min !== 0 && dsx_max !== null || 
            dsy_min !== 0 && dsy_max !== null || 
            dsz_min !== 0 && dsz_max !== null) {
            shakeCamera(
                camera,
                camera.position.x,
                camera.position.y,
                camera.position.z,
                dsx_min,
                dsx_max,
                dsy_min,
                dsy_max,
                dsz_min,
                dsz_max
            );
        }
    }, 10);
}

const shakeCamera = (camera, x, y, z, x_min, x_max, y_min, y_max, z_min, z_max) => {
    camera.position.set(
        x + Math.random() * (x_max - x_min) + x_min,
        y + Math.random() * (y_max - y_min) + y_min,
        z + Math.random() * (z_max - z_min) + z_min
    );
}

const cameraLoop = (callback, framerate = 10) => {
    cameraInterval = setInterval(callback, framerate);
}

const stopCameraLoop = () => {
    clearInterval(cameraInterval);
}

const stopCamera = () => {
    clearInterval(cameraMovementInterval);
}

const particlesLoop = (callback, framerate = 10) => {
    particlesInterval = setInterval(callback, framerate);
}

const stopParticlesLoop = () => {
    clearInterval(particlesInterval);
}

const meshesLoop = (callback, framerate = 10) => {
    meshesInterval = setInterval(callback, framerate);
}

const stopMeshesLoop = () => {
    clearInterval(meshesInterval);
}

const loop = (callback, framerate = 10) => {
    interval = setInterval(callback, framerate);
}

const stopLoop = () => {
    clearInterval(interval);
}

export default {
    moveCamera,
    stopCamera,
    cameraLoop,
    stopCameraLoop,
    loop,
    stopLoop,
    shakeCamera,
    particlesLoop,
    stopParticlesLoop,
    meshesLoop,
    stopMeshesLoop,
}
